package com.advance.hirfa.filter;

import com.advance.hirfa.domaine.entities.User;
import com.advance.hirfa.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
public class UserProvisioningFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    public UserProvisioningFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null
                && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof Jwt jwt) {

            try {
                UUID keycloakId = UUID.fromString(jwt.getSubject());

                if (!userRepository.existsById(keycloakId)) {
                    // Fallback extractions if preferred_username or email are missing from token claims
                    String username = jwt.getClaimAsString("preferred_username");
                    if (username == null || username.isBlank()) {
                        username = jwt.getClaimAsString("sub");
                    }

                    String email = jwt.getClaimAsString("email");
                    if (email == null || email.isBlank()) {
                        email = username + "@placeholder.com";
                    }

                    User user = User.builder()
                            .id(keycloakId)
                            .name(username)
                            .email(email)
                            .createAt(LocalDateTime.now())
                            .build();

                    userRepository.save(user);
                }
            } catch (Exception e) {
                // Prevents provisioning failures from crashing the request filter chain
                logger.error("Failed to auto-provision user from Keycloak JWT token", e);
            }
        }

        filterChain.doFilter(request, response);
    }
}