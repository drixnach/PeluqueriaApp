using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Pelu.Models;

public partial class PeluqueriaDbContext : DbContext
{
    public PeluqueriaDbContext()
    {
    }

    public PeluqueriaDbContext(DbContextOptions<PeluqueriaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<DetalleTurno> DetalleTurnos { get; set; }

    public virtual DbSet<Direccion> Direccions { get; set; }

    public virtual DbSet<HorariosPeluqueria> HorariosPeluqueria { get; set; }

    public virtual DbSet<HorariosPeluquero> HorariosPeluqueros { get; set; }

    public virtual DbSet<Peluqueria> Peluqueria { get; set; }

    public virtual DbSet<Peluquero> Peluqueros { get; set; }

    public virtual DbSet<PeluqueroxServicio> PeluqueroxServicios { get; set; }

    public virtual DbSet<Servicio> Servicios { get; set; }

    public virtual DbSet<Turno> Turnos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
        
            // optionsBuilder.UseSqlServer("Server=DESKTOP-R3NFP9O\\SQLEXPRESS;Database=PeluqueriaDb;Trusted_Connection=True;TrustServerCertificate=True;");
        }
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.ClienteId).HasName("PK__Cliente__71ABD087BCD21D43");

            entity.ToTable("Cliente");

            entity.Property(e => e.Apellido).HasMaxLength(100);
            entity.Property(e => e.Correo).HasMaxLength(150);
            entity.Property(e => e.Nombre).HasMaxLength(100);
            entity.Property(e => e.Sexo).HasMaxLength(20);
            entity.Property(e => e.Telefono).HasMaxLength(20);
        });

        modelBuilder.Entity<DetalleTurno>(entity =>
        {
            entity.HasKey(e => e.DetalleTurnoId).HasName("PK__DetalleT__E2503483D2C30D1F");

            entity.ToTable("DetalleTurno");

            entity.Property(e => e.Precio).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Servicio).WithMany(p => p.DetalleTurnos)
                .HasForeignKey(d => d.ServicioId)
                .HasConstraintName("FK_Detalle_Servicio");

            entity.HasOne(d => d.Turno).WithMany(p => p.DetalleTurnos)
                .HasForeignKey(d => d.TurnoId)
                .HasConstraintName("FK_Detalle_Turno");
        });

        modelBuilder.Entity<Direccion>(entity =>
        {
            entity.HasKey(e => e.DireccionId).HasName("PK__Direccio__68906D64485D93D8");

            entity.ToTable("Direccion");

            entity.Property(e => e.Altura).HasMaxLength(10);
            entity.Property(e => e.Calle).HasMaxLength(100);
            entity.Property(e => e.Ciudad).HasMaxLength(100);
            entity.Property(e => e.CodigoPostal).HasMaxLength(20);
            entity.Property(e => e.Pais).HasMaxLength(100);
            entity.Property(e => e.Provincia).HasMaxLength(100);
        });

        modelBuilder.Entity<HorariosPeluqueria>(entity =>
        {
            entity.HasKey(e => e.HorarioPeluqueriaId).HasName("PK__Horarios__722DB8F1667ADBA5");

            entity.HasOne(d => d.Peluqueria).WithMany(p => p.HorariosPeluqueria)
                .HasForeignKey(d => d.PeluqueriaId)
                .HasConstraintName("FK_Horario_Peluqueria");
        });

        modelBuilder.Entity<HorariosPeluquero>(entity =>
        {
            entity.HasKey(e => e.HorarioPeluqueroId).HasName("PK__Horarios__B4648C3D134C9722");

            entity.ToTable("HorariosPeluquero");

            entity.HasOne(d => d.Peluquero).WithMany(p => p.HorariosPeluqueros)
                .HasForeignKey(d => d.PeluqueroId)
                .HasConstraintName("FK_Horario_Peluquero");
        });

        modelBuilder.Entity<Peluqueria>(entity =>
        {
            entity.HasKey(e => e.PeluqueriaId).HasName("PK__Peluquer__DBB815B18398541B");

            entity.Property(e => e.Nombre).HasMaxLength(100);
            entity.Property(e => e.Telefono).HasMaxLength(20);

            entity.HasOne(d => d.Direccion).WithMany(p => p.Peluqueria)
                .HasForeignKey(d => d.DireccionId)
                .HasConstraintName("FK_Peluqueria_Direccion");
        });

        modelBuilder.Entity<Peluquero>(entity =>
        {
            entity.HasKey(e => e.PeluqueroId).HasName("PK__Peluquer__4C7D55C897E60C43");

            entity.ToTable("Peluquero");

            entity.Property(e => e.Apellido).HasMaxLength(100);
            entity.Property(e => e.Cuil)
                .HasMaxLength(20)
                .HasColumnName("CUIL");
            entity.Property(e => e.Nombre).HasMaxLength(100);
            entity.Property(e => e.Telefono).HasMaxLength(20);

            entity.HasOne(d => d.Direccion).WithMany(p => p.Peluqueros)
                .HasForeignKey(d => d.DireccionId)
                .HasConstraintName("FK_Peluquero_Direccion");

            entity.HasOne(d => d.Peluqueria).WithMany(p => p.Peluqueros)
                .HasForeignKey(d => d.PeluqueriaId)
                .HasConstraintName("FK_Peluquero_Peluqueria");
        });

        modelBuilder.Entity<PeluqueroxServicio>(entity =>
        {
            entity.HasKey(e => e.EmpleadoxServicioId).HasName("PK__Peluquer__2D5679AE7B69E547");

            entity.ToTable("PeluqueroxServicio");

            entity.HasOne(d => d.Peluquero).WithMany(p => p.PeluqueroxServicios)
                .HasForeignKey(d => d.PeluqueroId)
                .HasConstraintName("FK_PxS_Peluquero");

            entity.HasOne(d => d.Servicio).WithMany(p => p.PeluqueroxServicios)
                .HasForeignKey(d => d.ServicioId)
                .HasConstraintName("FK_PxS_Servicio");
        });

        modelBuilder.Entity<Servicio>(entity =>
        {
            entity.HasKey(e => e.ServicioId).HasName("PK__Servicio__D5AEECC236486D0B");

            entity.ToTable("Servicio");

            entity.Property(e => e.Descripcion).HasMaxLength(255);
            entity.Property(e => e.Nombre).HasMaxLength(100);
            entity.Property(e => e.Precio).HasColumnType("decimal(10, 2)");
        });

        modelBuilder.Entity<Turno>(entity =>
        {
            entity.HasKey(e => e.TurnoId).HasName("PK__Turnos__AD3E2E94F6127857");

            entity.Property(e => e.FechaCreacion).HasColumnType("datetime");
            entity.Property(e => e.FechaFinTurno).HasColumnType("datetime");
            entity.Property(e => e.FechaInicioTurno).HasColumnType("datetime");

            entity.HasOne(d => d.Cliente).WithMany(p => p.Turnos)
                .HasForeignKey(d => d.ClienteId)
                .HasConstraintName("FK_Turno_Cliente");

            entity.HasOne(d => d.Peluqueria).WithMany(p => p.Turnos)
                .HasForeignKey(d => d.PeluqueriaId)
                .HasConstraintName("FK_Turno_Peluqueria");

            entity.HasOne(d => d.Peluquero).WithMany(p => p.Turnos)
                .HasForeignKey(d => d.PeluqueroId)
                .HasConstraintName("FK_Turno_Peluquero");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
