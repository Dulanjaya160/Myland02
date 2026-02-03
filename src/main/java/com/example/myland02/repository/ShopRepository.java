package com.example.myland02.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.myland02.model.Shop;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
}
