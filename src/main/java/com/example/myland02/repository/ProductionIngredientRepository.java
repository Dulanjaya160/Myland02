package com.example.myland02.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.myland02.model.ProductionIngredient;
import com.example.myland02.model.Production;
import java.util.List;

@Repository
public interface ProductionIngredientRepository extends JpaRepository<ProductionIngredient, Long> {
    List<ProductionIngredient> findByProduction(Production production);
}
