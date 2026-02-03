package com.example.myland02.dto;

import com.example.myland02.model.Product;
import java.time.LocalDate;
import java.util.List;

public class ProductionRequest {
    private Product product;
    private LocalDate date;
    private int producedUnits;
    private List<ProductionIngredientRequest> usedIngredients;

    // Default constructor
    public ProductionRequest() {}

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getProducedUnits() {
        return producedUnits;
    }

    public void setProducedUnits(int producedUnits) {
        this.producedUnits = producedUnits;
    }

    public List<ProductionIngredientRequest> getUsedIngredients() {
        return usedIngredients;
    }

    public void setUsedIngredients(List<ProductionIngredientRequest> usedIngredients) {
        this.usedIngredients = usedIngredients;
    }
}
