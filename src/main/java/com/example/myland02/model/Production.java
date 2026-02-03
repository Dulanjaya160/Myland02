package com.example.myland02.model;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Entity
public class Production {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    @ManyToOne
    private Product product;
    private int producedUnits;
    
    @OneToMany(mappedBy = "production", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<ProductionIngredient> usedIngredients;

    // Default constructor
    public Production() {
        this.usedIngredients = new ArrayList<>();
    }

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

    public int getProducedUnits() {
        return producedUnits;
    }

    public void setProducedUnits(int producedUnits) {
        this.producedUnits = producedUnits;
    }

    public List<ProductionIngredient> getUsedIngredients() {
        return usedIngredients;
    }

    public void setUsedIngredients(List<ProductionIngredient> usedIngredients) {
        this.usedIngredients = usedIngredients;
    }
}
