package com.zzp.financemanager.dto;

import java.time.LocalDate;

public class ExpenseRequest {
    private double amount;
    private String category;
    private LocalDate date;
    private String description;

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
