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
@Table(name= "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @Column(name= "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="email", nullable = false)
    private String email;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createAt;

    @LastModifiedBy
    @Column(name = "updated_at", updatable = false)
    private LocalDate updateAt;

    @Builder.Default
    @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL)
    private List<Event> organizedEvents= new ArrayList<>();

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name= "user_attending_events",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns= @JoinColumn(name= "event_id")
    )

    private List<Event> attendingEvents= new ArrayList<>();

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name= "user_sttafing_events",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns= @JoinColumn(name= "event_id")
    )
    private List<Event> staffingEvents= new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(name, user.name) && Objects.equals(email, user.email) && Objects.equals(createAt, user.createAt) && Objects.equals(updateAt, user.updateAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, email, createAt, updateAt);
    }
}
