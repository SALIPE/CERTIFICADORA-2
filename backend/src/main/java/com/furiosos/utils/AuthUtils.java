package com.furiosos.utils;

public class AuthUtils {

    private static final ThreadLocal<String> userIdContext = new ThreadLocal<>();
    private static final ThreadLocal<String> userRoleContext = new ThreadLocal<>();
    private static final ThreadLocal<String> userNameContext = new ThreadLocal<>();

    public static void setCurrentUserId(String userId) {
        userIdContext.set(userId);
    }

    public static void setCurrentUserRole(String role) {
        userRoleContext.set(role);
    }

    public static void setCurrentUserName(String name) {
        userNameContext.set(name);
    }

    public static String getCurrentUserId() {
        String userId = userIdContext.get();
        if (userId == null) {
            throw new IllegalStateException("Nenhum usuário autenticado no contexto");
        }
        return userId;
    }

    public static String getCurrentUserRole() {
        String role = userRoleContext.get();
        if (role == null) {
            throw new IllegalStateException("Nenhum role do usuário no contexto");
        }
        return role;
    }

    public static String getCurrentUserName() {
        String name = userNameContext.get();
        if (name == null) {
            throw new IllegalStateException("Nenhum nome do usuário no contexto");
        }
        return name;
    }

    public static boolean isAdmin() {
        try {
            return "ADMIN".equals(getCurrentUserRole());
        } catch (IllegalStateException e) {
            return false;
        }
    }

    public static boolean isAluno() {
        try {
            return "ALUNO".equals(getCurrentUserRole());
        } catch (IllegalStateException e) {
            return false;
        }
    }

    public static void clear() {
        userIdContext.remove();
        userRoleContext.remove();
        userNameContext.remove();
    }
}
