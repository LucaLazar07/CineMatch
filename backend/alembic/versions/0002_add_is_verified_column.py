"""add is_verified column to users

Revision ID: 0002_add_is_verified_column
Revises: 0001_create_core_user_tables
Create Date: 2026-06-01 00:10:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0002_add_is_verified_column"
down_revision = "0001_create_core_user_tables"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")))


def downgrade() -> None:
    op.drop_column("users", "is_verified")
