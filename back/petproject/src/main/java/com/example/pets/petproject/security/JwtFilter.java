package com.example.pets.petproject.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtFilter implements Filter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;

        String authHeader = req.getHeader("Authorization");

        // Permitir login sin token
        if (req.getRequestURI().contains("/auth/login")) {
            chain.doFilter(request, response);
            return;
        }

        // =========================
        // COMENTADO PARA PRUEBAS: NO BLOQUEAR POR JWT
        /*
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token ausente");
            return;
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.isTokenValid(token)) {
            ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido");
            return;
        }

        Claims claims = jwtUtil.extractClaims(token);
        request.setAttribute("claims", claims);
        */
        // =========================

        chain.doFilter(request, response); // permite pasar todas las solicitudes
    }
}
