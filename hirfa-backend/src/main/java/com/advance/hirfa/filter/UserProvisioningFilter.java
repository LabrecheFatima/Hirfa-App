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

    // Inject UserRepository via constructor
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

            UUID keycloakId = UUID.fromString(jwt.getSubject());

            if (!userRepository.existsById(keycloakId)) {
                User user = User.builder()
                        .id(keycloakId)
                        .name(jwt.getClaimAsString("preferred_username"))
                        .email(jwt.getClaimAsString("email"))
                        .createAt(LocalDateTime.now())
                        .build();

                userRepository.save(user);
            }
        }


        filterChain.doFilter(request, response);
    }
}