package com.example.myland02.dto;

public class ProductionIngredientRequest {
    private Long ingredientId;
    private double quantityUsed;

    // Default constructor
    public ProductionIngredientRequest() {}

    public Long getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(Long ingredientId) {
        this.ingredientId = ingredientId;
    }

    public double getQuantityUsed() {
        return quantityUsed;
    }

    public void setQuantityUsed(double quantityUsed) {
        this.quantityUsed = quantityUsed;
    }
}
