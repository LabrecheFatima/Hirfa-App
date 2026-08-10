package com.advance.hirfa.config;

import com.advance.hirfa.filter.UserProvisioningFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            UserProvisioningFilter userProvisioningFilter,
            JwtAuthenticationConverter jwtAuthenticationConverter,
            CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
                // Enable CORS in Spring Security
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                .authorizeHttpRequests(authorize -> authorize
                        // Public endpoints
                        .requestMatchers(HttpMethod.GET, "/api/v1/published-events/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/payments/chargily/webhook").permitAll()

                        // Role endpoints - allow both ATTENDEE_ROLE and ORGANISER_ROLE to purchase and view tickets
                        .requestMatchers(HttpMethod.POST, "/api/v1/events/*/ticket-types/*/tickets").hasAnyAuthority("ATTENDEE_ROLE", "ORGANISER_ROLE")
                        .requestMatchers("/api/v1/tickets/**", "/api/v1/my-tickets/**", "/api/v1/claims/**").hasAnyAuthority("ATTENDEE_ROLE", "ORGANISER_ROLE")

                        // Organizer management endpoints
                        .requestMatchers("/api/v1/events/**").hasAuthority("ORGANISER_ROLE")
                        .requestMatchers("/api/v1/ticket-validations/**").hasAnyAuthority("STAFF_ROLE", "ORGANISER_ROLE")

                        // Catch all rule
                        .anyRequest().authenticated()
                )

                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
                )

                .addFilterAfter(userProvisioningFilter, BearerTokenAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow requests from React frontend on ports 3000 and 5173
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));

        // Allow standard REST methods & CORS pre-flight OPTIONS
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Allow Authorization header (for Keycloak Bearer token) and Content-Type
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With", "Accept"));

        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder
                .withJwkSetUri("http://localhost:9090/realms/app-realm/protocol/openid-connect/certs")
                .build();
    }

}