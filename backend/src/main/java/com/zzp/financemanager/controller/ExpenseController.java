package com.zzp.financemanager.controller;

import com.zzp.financemanager.model.Expense;
import com.zzp.financemanager.model.MonthlySummary;
import com.zzp.financemanager.service.ExpenseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<Expense> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            HttpServletRequest request) {
        if (category == null && from == null && to == null) {
            return expenseService.getAll(request);
        }
        return expenseService.getFiltered(category, from, to, request);
    }

    @PostMapping
    public ResponseEntity<Expense> add(@RequestBody Expense expense,
                                       HttpServletRequest request,
                                       HttpServletResponse response) {
        if (expense.getAmount() <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(expenseService.add(expense, request, response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> update(@PathVariable String id,
                                          @RequestBody Expense expense,
                                          HttpServletRequest request,
                                          HttpServletResponse response) {
        if (expense.getAmount() <= 0) {
            return ResponseEntity.badRequest().build();
        }
        try {
            return ResponseEntity.ok(expenseService.update(id, expense, request, response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id,
                                       HttpServletRequest request,
                                       HttpServletResponse response) {
        try {
            expenseService.delete(id, request, response);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/summary")
    public MonthlySummary getMonthlySummary(@RequestParam int year,
                                            @RequestParam int month,
                                            HttpServletRequest request) {
        return expenseService.getMonthlySummary(year, month, request);
    }

    @GetMapping("/summary/categories")
    public Map<String, Double> getCategoryBreakdown(@RequestParam int year,
                                                    @RequestParam int month,
                                                    HttpServletRequest request) {
        return expenseService.getCategoryBreakdown(year, month, request);
    }
}
