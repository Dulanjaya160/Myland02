package com.example.myland02.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "ingredient_type", nullable = false)
    private String type; // KG, GRAMS, LITERS, PIECES, etc.

    @Column
    private Double quantity;

    @Column
    private Double pricePerUnit;
}
