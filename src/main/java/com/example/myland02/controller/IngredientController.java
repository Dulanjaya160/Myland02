package com.example.myland02.controller;

import com.example.myland02.model.Ingredient;
import com.example.myland02.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/myland")
@CrossOrigin(origins = "*")
public class IngredientController {

    @Autowired
    private IngredientRepository ingredientRepo;

    @PostMapping("/ingredient")
    @Transactional
    public ResponseEntity<?> addIngredient(@RequestBody Ingredient ingredient) {
        try {
            System.out.println("DEBUG: IngredientController: Received request");
            System.out.println("DEBUG: Name: " + ingredient.getName());
            System.out.println("DEBUG: Type: " + ingredient.getType());
            System.out.println("DEBUG: Quantity: " + ingredient.getQuantity());
            System.out.println("DEBUG: Price: " + ingredient.getPricePerUnit());

            if (ingredient.getType() == null || ingredient.getType().isEmpty()) {
                System.err.println("✗ Error: Ingredient type is missing");
                return ResponseEntity.badRequest().body("Ingredient type is required");
            }

            Ingredient saved = ingredientRepo.save(ingredient);
            System.out.println("✓ Ingredient saved with ID: " + saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("✗ Error processing ingredient: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving ingredient: " + e.getMessage());
        }
    }

    @GetMapping("/ingredients")
    public ResponseEntity<?> getIngredients() {
        try {
            System.out.println("DEBUG: Fetching all ingredients");
            List<Ingredient> ingredients = ingredientRepo.findAll();
            System.out.println("DEBUG: Found " + ingredients.size() + " ingredients");
            return ResponseEntity.ok(ingredients);
        } catch (Exception e) {
            System.err.println("✗ Error fetching ingredients: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching ingredients: " + e.getMessage());
        }
    }

    @DeleteMapping("/ingredient/{id}")
    @Transactional
    public ResponseEntity<?> deleteIngredient(@PathVariable Long id) {
        try {
            System.out.println("DEBUG: Deleting ingredient " + id);
            ingredientRepo.deleteById(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            System.err.println("✗ Error deleting ingredient: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting ingredient: " + e.getMessage());
        }
    }
}
