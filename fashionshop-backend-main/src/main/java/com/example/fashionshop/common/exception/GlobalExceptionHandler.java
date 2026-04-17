import org.springframework.security.core.userdetails.UsernameNotFoundException;

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUsernameNotFound(UsernameNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(ex.getMessage()));
    }
package com.example.fashionshop.common.exception;

import com.example.fashionshop.common.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler({BadRequestException.class, InvalidAccountDeletionException.class, AccountCreationException.class})
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Object>> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler({ForbiddenException.class, AccessDeniedException.class})
    public ResponseEntity<ApiResponse<Object>> handleForbidden(Exception ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied"));
    }


    @ExceptionHandler(PaymentCancelledException.class)
    public ResponseEntity<ApiResponse<Object>> handlePaymentCancelled(PaymentCancelledException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(PaymentGatewayException.class)
    public ResponseEntity<ApiResponse<Object>> handlePaymentGatewayFailure(PaymentGatewayException ex) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler({
            HomeDataLoadException.class,
            ProductDetailLoadException.class,
            ProductListLoadException.class,
            OrderListLoadException.class,
            OrderDetailLoadException.class,
            OrderStatusUpdateException.class,
            InvoiceListLoadException.class,
            InvoiceDetailLoadException.class,
            ProductDeletionException.class,
            ProductUpdateException.class,
            ProfileRetrievalException.class,
            ProfileUpdateException.class,
            DashboardLoadException.class,
            StaffAccountLoadException.class,
            AccountDeletionException.class,
            CustomerAccountRetrievalException.class,
            AuthenticationSystemException.class,
            OrderCancellationException.class,
            StoreProductListLoadException.class,
            CartLoadException.class,
            CartUpdateException.class,
            WishlistUpdateException.class,
            SearchResultLoadException.class,
            StoreProductDetailLoadException.class,
            OrderPlacementException.class,
            PaymentStatusLoadException.class,
            OrderStatusLoadException.class
    })
    public ResponseEntity<ApiResponse<Object>> handleInternalFailure(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolation(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
                .map(v -> v.getMessage())
                .findFirst()
                .orElse("Invalid request parameter");
        return ResponseEntity.badRequest().body(ApiResponse.error(message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        boolean hasMissingRequiredField = false;
        Map<String, String> errors = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
            if ("NotBlank".equals(error.getCode()) || "NotNull".equals(error.getCode())) {
                hasMissingRequiredField = true;
            }
        }

        if (hasMissingRequiredField) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Please fill in all required fields"));
        }

        if (errors.size() == 1
                && errors.containsKey("quantity")
                && "Invalid quantity".equals(errors.get("quantity"))) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid quantity"));
        }

        return ResponseEntity.badRequest().body(ApiResponse.error("Validation failed: " + errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleUnknown(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred. Please try again later."));
    }
}