package com.advance.hirfa.domaine.entities;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name= "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name= "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name= "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private TicketStatusEnum status;

    @Column(name = "chargily_checkout_id")
    private String chargilyCheckoutId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name= "ticket_type_id")
    private TicketType ticketType;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name= "purchase_id")
    private User purchase;

    @Builder.Default
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<TicketValidation> validation = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<QrCode> qrCodes = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createAt;

    @LastModifiedBy
    @Column(name = "updated_at", updatable = false)
    private LocalDate updateAt;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Ticket ticket = (Ticket) o;
        return Objects.equals(id, ticket.id) && status == ticket.status && Objects.equals(ticketType, ticket.ticketType) && Objects.equals(createAt, ticket.createAt) && Objects.equals(updateAt, ticket.updateAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, status, ticketType, createAt, updateAt);
    }
}