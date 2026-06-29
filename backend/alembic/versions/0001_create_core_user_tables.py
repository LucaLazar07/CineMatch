"""create core user tables

Revision ID: 0001_create_core_user_tables
Revises: 
Create Date: 2026-06-01 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0001_create_core_user_tables"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("first_name", sa.String(), nullable=False),
        sa.Column("last_name", sa.String(), nullable=False),
        sa.Column("display_name", sa.String(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    op.create_table(
        "user_preferred_genres",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("genre_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "genre_id"),
    )
    op.create_index(op.f("ix_user_preferred_genres_id"), "user_preferred_genres", ["id"], unique=False)
    op.create_index(op.f("ix_user_preferred_genres_user_id"), "user_preferred_genres", ["user_id"], unique=False)
    op.create_index(op.f("ix_user_preferred_genres_genre_id"), "user_preferred_genres", ["genre_id"], unique=False)

    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("jti", sa.String(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f("ix_refresh_tokens_id"), "refresh_tokens", ["id"], unique=False)
    op.create_index(op.f("ix_refresh_tokens_user_id"), "refresh_tokens", ["user_id"], unique=False)
    op.create_index(op.f("ix_refresh_tokens_jti"), "refresh_tokens", ["jti"], unique=True)

    op.create_table(
        "user_saved_movies",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("movie_id", sa.Integer(), nullable=False),
        sa.Column("saved_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "movie_id"),
    )
    op.create_index(op.f("ix_user_saved_movies_id"), "user_saved_movies", ["id"], unique=False)
    op.create_index(op.f("ix_user_saved_movies_user_id"), "user_saved_movies", ["user_id"], unique=False)
    op.create_index(op.f("ix_user_saved_movies_movie_id"), "user_saved_movies", ["movie_id"], unique=False)

    op.create_table(
        "user_watched_movies",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("movie_id", sa.Integer(), nullable=False),
        sa.Column("watched_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "movie_id"),
    )
    op.create_index(op.f("ix_user_watched_movies_id"), "user_watched_movies", ["id"], unique=False)
    op.create_index(op.f("ix_user_watched_movies_user_id"), "user_watched_movies", ["user_id"], unique=False)
    op.create_index(op.f("ix_user_watched_movies_movie_id"), "user_watched_movies", ["movie_id"], unique=False)

    op.create_table(
        "user_movie_notes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("movie_id", sa.Integer(), nullable=False),
        sa.Column("note_text", sa.Text(), nullable=False, server_default=""),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "movie_id"),
    )
    op.create_index(op.f("ix_user_movie_notes_id"), "user_movie_notes", ["id"], unique=False)
    op.create_index(op.f("ix_user_movie_notes_user_id"), "user_movie_notes", ["user_id"], unique=False)
    op.create_index(op.f("ix_user_movie_notes_movie_id"), "user_movie_notes", ["movie_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_user_movie_notes_movie_id"), table_name="user_movie_notes")
    op.drop_index(op.f("ix_user_movie_notes_user_id"), table_name="user_movie_notes")
    op.drop_index(op.f("ix_user_movie_notes_id"), table_name="user_movie_notes")
    op.drop_table("user_movie_notes")

    op.drop_index(op.f("ix_user_watched_movies_movie_id"), table_name="user_watched_movies")
    op.drop_index(op.f("ix_user_watched_movies_user_id"), table_name="user_watched_movies")
    op.drop_index(op.f("ix_user_watched_movies_id"), table_name="user_watched_movies")
    op.drop_table("user_watched_movies")

    op.drop_index(op.f("ix_user_saved_movies_movie_id"), table_name="user_saved_movies")
    op.drop_index(op.f("ix_user_saved_movies_user_id"), table_name="user_saved_movies")
    op.drop_index(op.f("ix_user_saved_movies_id"), table_name="user_saved_movies")
    op.drop_table("user_saved_movies")

    op.drop_index(op.f("ix_refresh_tokens_jti"), table_name="refresh_tokens")
    op.drop_index(op.f("ix_refresh_tokens_user_id"), table_name="refresh_tokens")
    op.drop_index(op.f("ix_refresh_tokens_id"), table_name="refresh_tokens")
    op.drop_table("refresh_tokens")

    op.drop_index(op.f("ix_user_preferred_genres_genre_id"), table_name="user_preferred_genres")
    op.drop_index(op.f("ix_user_preferred_genres_user_id"), table_name="user_preferred_genres")
    op.drop_index(op.f("ix_user_preferred_genres_id"), table_name="user_preferred_genres")
    op.drop_table("user_preferred_genres")

    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")