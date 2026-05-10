package com.zzp.financemanager.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.zzp.financemanager.model.Expense;
import com.zzp.financemanager.model.MonthlySummary;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private static final String COOKIE_NAME = "expenses";
    private static final int COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

    private final ObjectMapper objectMapper;

    public ExpenseService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    public List<Expense> getAll(HttpServletRequest request) {
        return readFromCookie(request);
    }

    public List<Expense> getFiltered(String category, LocalDate from, LocalDate to, HttpServletRequest request) {
        return readFromCookie(request).stream()
                .filter(e -> category == null || e.getCategory().equalsIgnoreCase(category))
                .filter(e -> from == null || !e.getDate().isBefore(from))
                .filter(e -> to == null || !e.getDate().isAfter(to))
                .collect(Collectors.toList());
    }

    public Expense add(Expense expense, HttpServletRequest request, HttpServletResponse response) {
        List<Expense> expenses = readFromCookie(request);
        expense.setId(UUID.randomUUID().toString());
        expenses.add(expense);
        writeToCookie(expenses, response);
        return expense;
    }

    public Expense update(String id, Expense updated, HttpServletRequest request, HttpServletResponse response) {
        List<Expense> expenses = readFromCookie(request);
        for (Expense e : expenses) {
            if (e.getId().equals(id)) {
                e.setAmount(updated.getAmount());
                e.setCategory(updated.getCategory());
                e.setDate(updated.getDate());
                e.setDescription(updated.getDescription());
                writeToCookie(expenses, response);
                return e;
            }
        }
        throw new IllegalArgumentException("Expense not found: " + id);
    }

    public void delete(String id, HttpServletRequest request, HttpServletResponse response) {
        List<Expense> expenses = readFromCookie(request);
        boolean removed = expenses.removeIf(e -> e.getId().equals(id));
        if (!removed) throw new IllegalArgumentException("Expense not found: " + id);
        writeToCookie(expenses, response);
    }

    public MonthlySummary getMonthlySummary(int year, int month, HttpServletRequest request) {
        double total = readFromCookie(request).stream()
                .filter(e -> e.getDate().getYear() == year && e.getDate().getMonthValue() == month)
                .mapToDouble(Expense::getAmount)
                .sum();
        return new MonthlySummary(year, month, total);
    }

    public Map<String, Double> getCategoryBreakdown(int year, int month, HttpServletRequest request) {
        return readFromCookie(request).stream()
                .filter(e -> e.getDate().getYear() == year && e.getDate().getMonthValue() == month)
                .collect(Collectors.groupingBy(Expense::getCategory, Collectors.summingDouble(Expense::getAmount)));
    }

    private List<Expense> readFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return new ArrayList<>();
        for (Cookie cookie : request.getCookies()) {
            if (COOKIE_NAME.equals(cookie.getName())) {
                try {
                    String json = URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8);
                    return objectMapper.readValue(json, new TypeReference<List<Expense>>() {});
                } catch (Exception e) {
                    return new ArrayList<>();
                }
            }
        }
        return new ArrayList<>();
    }

    private void writeToCookie(List<Expense> expenses, HttpServletResponse response) {
        try {
            String json = objectMapper.writeValueAsString(expenses);
            String encoded = URLEncoder.encode(json, StandardCharsets.UTF_8);
            Cookie cookie = new Cookie(COOKIE_NAME, encoded);
            cookie.setMaxAge(COOKIE_MAX_AGE);
            cookie.setPath("/");
            response.addCookie(cookie);
        } catch (Exception e) {
            throw new RuntimeException("Failed to write expenses cookie", e);
        }
    }
}
