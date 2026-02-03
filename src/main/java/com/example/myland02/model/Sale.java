package com.example.myland02.model;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    @ManyToOne
    @JsonIgnoreProperties({"ingredients"})
    private Product product;
    @ManyToOne
    @JsonIgnoreProperties({"sales"})
    private Shop shop;
    private int soldUnits;
    private int returnedUnits;

    // Default constructor
    public Sale() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getSoldUnits() {
        return soldUnits;
    }

    public void setSoldUnits(int soldUnits) {
        this.soldUnits = soldUnits;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public int getReturnedUnits() {
        return returnedUnits;
    }

    public void setReturnedUnits(int returnedUnits) {
        this.returnedUnits = returnedUnits;
    }

    // Calculate income automatically based on selling price and sold units
    public double getIncome() {
        if (product != null && product.getSellingPrice() > 0) {
            return product.getSellingPrice() * soldUnits;
        }
        return 0.0;
    }

    // Calculate profit automatically based on selling price, product cost and sold units
    public double getProfit() {
        if (product != null && product.getSellingPrice() > 0 && product.getProductCost() > 0) {
            return (product.getSellingPrice() - product.getProductCost()) * soldUnits;
        }
        return 0.0;
    }
}
