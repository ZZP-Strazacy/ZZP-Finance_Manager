package com.zzp.financemanager.model;

public class MonthlySummary {
    private int year;
    private int month;
    private double total;

    public MonthlySummary(int year, int month, double total) {
        this.year = year;
        this.month = month;
        this.total = total;
    }

    public int getYear() { return year; }
    public int getMonth() { return month; }
    public double getTotal() { return total; }
}
