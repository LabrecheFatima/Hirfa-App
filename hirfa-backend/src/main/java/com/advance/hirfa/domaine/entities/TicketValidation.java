package com.advance.hirfa.domaine.entities;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name= "ticket_validations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketValidation {
    @Id
    @Column(name= "id", updatable = false, nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name= "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private TicketValidationEnum status;

    @Column(name= "validation_method", nullable = false)
    @Enumerated(EnumType.STRING)
    private TicketValidationMethod validationMethod;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name= "ticket_id")
    private Ticket ticket;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updateAt;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        TicketValidation that = (TicketValidation) o;
        return Objects.equals(id, that.id) && status == that.status && validationMethod == that.validationMethod && Objects.equals(createAt, that.createAt) && Objects.equals(updateAt, that.updateAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, status, createAt, updateAt);
    }
}
