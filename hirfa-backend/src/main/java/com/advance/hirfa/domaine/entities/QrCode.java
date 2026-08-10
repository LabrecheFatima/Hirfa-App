package com.advance.hirfa.domaine.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name= "qrcode")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class QrCode {
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name="status", nullable = false)
    @Enumerated(EnumType.STRING)
    private QrCodeStatusEnum status;

    @Column(name="value", columnDefinition= "TEXT", nullable = false)
    private String value;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name= "ticket_id")
    private Ticket ticket;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createAt;

    @LastModifiedBy
    @Column(name = "updated_at", updatable = false)
    private LocalDate updateAt;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        QrCode qrCode = (QrCode) o;
        return Objects.equals(id, qrCode.id) && status == qrCode.status && Objects.equals(value, qrCode.value) && Objects.equals(createAt, qrCode.createAt) && Objects.equals(updateAt, qrCode.updateAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, status, value, createAt, updateAt);
    }
}
