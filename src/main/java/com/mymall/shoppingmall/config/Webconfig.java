package com.mymall.shoppingmall.config; // You can put it in the same config package

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class Webconfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Apply CORS to all /api endpoints or more specific paths
                // This is the line to make dynamic for localhost
                .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174") // Add all potential dev origins
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow common HTTP methods
                .allowedHeaders("*") // Allow all headers (be more specific in production)
                .allowCredentials(true) // Important if you use cookies or Authorization headers
                .maxAge(3600); // Cache pre-flight requests for 1 hour
    }
}
