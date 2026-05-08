package com.furiosos.config;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.furiosos.auth.AuthJjwt;
import com.furiosos.exceptions.ApiRequestException;
import com.furiosos.utils.AuthUtils;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        // Allow OPTIONS requests for CORS preflight
        if ("OPTIONS".equals(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // Exceções: endpoints que não precisam de autenticação
        if (requestURI.contains("/furiosos/login") || requestURI.contains("/furiosos/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Se for requisição para /furiosos/*, validar token
        if (requestURI.startsWith("/furiosos/")) {
            try {
                String authHeader = request.getHeader("Authorization");

                if (authHeader == null || authHeader.isEmpty()) {
                    throw new ApiRequestException("Token não fornecido");
                }

                // Extrair dados do token
                String userId = AuthJjwt.extractUserIdFromToken(authHeader);
                String role = AuthJjwt.extractUserRoleFromToken(authHeader);
                String name = AuthJjwt.extractUserNameFromToken(authHeader);

                // Armazenar no contexto (ThreadLocal)
                AuthUtils.setCurrentUserId(userId);
                AuthUtils.setCurrentUserRole(role);
                AuthUtils.setCurrentUserName(name);

                filterChain.doFilter(request, response);

            } catch (ApiRequestException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"" + e.getMessage() + "\",\"httpStatus\":\"UNAUTHORIZED\"}");
            } finally {
                // Limpar contexto
                AuthUtils.clear();
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }
}
