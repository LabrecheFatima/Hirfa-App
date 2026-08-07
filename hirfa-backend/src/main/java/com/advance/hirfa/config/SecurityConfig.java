package com.advance.hirfa.config;

import com.advance.hirfa.filter.UserProvisioningFilter;
import org.springframework.context.annotation.Bean;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            UserProvisioningFilter userProvisioningFilter,
            JwtAuthenticationConverter jwtAuthenticationConverter) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        // public endpoints
                        .requestMatchers(HttpMethod.GET, "/api/v1/published-events/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/payments/chargily/webhook").permitAll()

                        // role endpoints
                        .requestMatchers(HttpMethod.POST, "/api/v1/events/*/ticket-types/*/tickets").hasAuthority("ATTENDEE_ROLE")
                        .requestMatchers("/api/v1/events/**").hasAuthority("ORGANISER_ROLE")
                        .requestMatchers("/api/v1/ticket-validations/**").hasAnyAuthority("STAFF_ROLE", "ORGANISER_ROLE")
                        .requestMatchers("/api/v1/tickets/**", "/api/v1/my-tickets/**", "/api/v1/claims/**").hasAuthority("ATTENDEE_ROLE")

                        // catch all rule
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
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder
                .withJwkSetUri("http://localhost:9090/realms/app-realm/protocol/openid-connect/certs")
                .build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}