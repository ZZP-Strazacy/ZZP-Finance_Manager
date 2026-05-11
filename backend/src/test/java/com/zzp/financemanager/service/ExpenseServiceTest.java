package com.zzp.financemanager.service;

import com.zzp.financemanager.model.Expense;
import com.zzp.financemanager.model.MonthlySummary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ExpenseServiceTest {

    private ExpenseService service;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        service = new ExpenseService();
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
    }

    @Test
    void addExpense_shouldAppearInList() {
        Expense expense = expense(50.0, "Food", LocalDate.of(2025, 5, 1));
        service.add(expense, request, response);

        syncCookies();
        List<Expense> all = service.getAll(request);

        assertThat(all).hasSize(1);
        assertThat(all.get(0).getAmount()).isEqualTo(50.0);
        assertThat(all.get(0).getCategory()).isEqualTo("Food");
    }

    @Test
    void deleteExpense_shouldRemoveFromList() {
        Expense added = service.add(expense(30.0, "Transport", LocalDate.of(2025, 5, 2)), request, response);
        syncCookies();

        service.delete(added.getId(), request, response);
        syncCookies();

        assertThat(service.getAll(request)).isEmpty();
    }

    @Test
    void updateExpense_shouldChangeValues() {
        Expense added = service.add(expense(10.0, "Other", LocalDate.of(2025, 5, 3)), request, response);
        syncCookies();

        Expense updated = expense(99.0, "Health", LocalDate.of(2025, 6, 1));
        service.update(added.getId(), updated, request, response);
        syncCookies();

        Expense result = service.getAll(request).get(0);
        assertThat(result.getAmount()).isEqualTo(99.0);
        assertThat(result.getCategory()).isEqualTo("Health");
    }

    @Test
    void deleteUnknownId_shouldThrow() {
        assertThatThrownBy(() -> service.delete("nonexistent", request, response))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void filterByCategory_shouldReturnOnlyMatching() {
        service.add(expense(20.0, "Food", LocalDate.of(2025, 5, 1)), request, response);
        syncCookies();
        service.add(expense(15.0, "Transport", LocalDate.of(2025, 5, 2)), request, response);
        syncCookies();

        List<Expense> filtered = service.getFiltered("Food", null, null, request);
        assertThat(filtered).hasSize(1);
        assertThat(filtered.get(0).getCategory()).isEqualTo("Food");
    }

    @Test
    void filterByDateRange_shouldReturnOnlyInRange() {
        service.add(expense(10.0, "Food", LocalDate.of(2025, 4, 1)), request, response);
        syncCookies();
        service.add(expense(20.0, "Food", LocalDate.of(2025, 5, 15)), request, response);
        syncCookies();

        List<Expense> filtered = service.getFiltered(null, LocalDate.of(2025, 5, 1), LocalDate.of(2025, 5, 31), request);
        assertThat(filtered).hasSize(1);
        assertThat(filtered.get(0).getAmount()).isEqualTo(20.0);
    }

    @Test
    void monthlySummary_shouldSumCorrectMonth() {
        service.add(expense(100.0, "Food", LocalDate.of(2025, 5, 1)), request, response);
        syncCookies();
        service.add(expense(50.0, "Food", LocalDate.of(2025, 5, 20)), request, response);
        syncCookies();
        service.add(expense(200.0, "Food", LocalDate.of(2025, 6, 1)), request, response);
        syncCookies();

        MonthlySummary summary = service.getMonthlySummary(2025, 5, request);
        assertThat(summary.getTotal()).isEqualTo(150.0);
    }

    @Test
    void categoryBreakdown_shouldGroupByCategory() {
        service.add(expense(40.0, "Food", LocalDate.of(2025, 5, 1)), request, response);
        syncCookies();
        service.add(expense(60.0, "Food", LocalDate.of(2025, 5, 2)), request, response);
        syncCookies();
        service.add(expense(30.0, "Transport", LocalDate.of(2025, 5, 3)), request, response);
        syncCookies();

        Map<String, Double> breakdown = service.getCategoryBreakdown(2025, 5, request);
        assertThat(breakdown.get("Food")).isEqualTo(100.0);
        assertThat(breakdown.get("Transport")).isEqualTo(30.0);
    }

        @Test
    void updateUnknownId_shouldThrow() {
        Expense updated = expense(99.0, "Food", LocalDate.of(2025, 5, 1));
        assertThatThrownBy(() -> service.update("nonexistent", updated, request, response))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void addMultipleExpenses_shouldAllAppearInList() {
        service.add(expense(10.0, "Food", LocalDate.of(2025, 5, 1)), request, response);
        syncCookies();
        service.add(expense(20.0, "Transport", LocalDate.of(2025, 5, 2)), request, response);
        syncCookies();

        assertThat(service.getAll(request)).hasSize(2);
    }

    @Test
    void filterByCategory_caseInsensitive_shouldMatch() {
        service.add(expense(25.0, "Food", LocalDate.of(2025, 5, 1)), request, response);
        syncCookies();

        List<Expense> filtered = service.getFiltered("food", null, null, request);
        assertThat(filtered).hasSize(1);
    }

    // Copies cookies from response back to next request to simulate browser behaviour
    private void syncCookies() {
        jakarta.servlet.http.Cookie[] cookies = response.getCookies();
        if (cookies != null) {
            request.setCookies(cookies);
        }
        response = new MockHttpServletResponse();
    }

    private Expense expense(double amount, String category, LocalDate date) {
        Expense e = new Expense();
        e.setAmount(amount);
        e.setCategory(category);
        e.setDate(date);
        e.setDescription("test");
        return e;
    }
}
