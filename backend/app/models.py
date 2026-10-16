from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


def _now():
    return datetime.now(timezone.utc)


class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    factor_id: Mapped[int] = mapped_column(primary_key=True)
    activity_type: Mapped[str] = mapped_column(String(64), index=True)
    region: Mapped[str] = mapped_column(String(64), index=True)
    factor_value: Mapped[float] = mapped_column(Float)
    factor_unit: Mapped[str] = mapped_column(String(32))
    source: Mapped[str] = mapped_column(String(255))
    source_year: Mapped[int | None] = mapped_column(Integer, nullable=True)


class FootprintReport(Base):
    __tablename__ = "footprint_reports"

    report_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True)  # future FK to users
    region: Mapped[str] = mapped_column(String(64))
    period: Mapped[str] = mapped_column(String(16))
    total_kg_co2e: Mapped[float] = mapped_column(Float)
    methodology_version: Mapped[str] = mapped_column(String(16))
    result_json: Mapped[str] = mapped_column(Text)  # full response snapshot
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)

    activities: Mapped[list["ActivityRecord"]] = relationship(
        back_populates="report", cascade="all, delete-orphan"
    )


class ActivityRecord(Base):
    __tablename__ = "activity_records"

    activity_id: Mapped[int] = mapped_column(primary_key=True)
    report_id: Mapped[int] = mapped_column(ForeignKey("footprint_reports.report_id"))
    category: Mapped[str] = mapped_column(String(32))
    activity_type: Mapped[str] = mapped_column(String(64))
    quantity: Mapped[float] = mapped_column(Float)
    unit: Mapped[str] = mapped_column(String(32))
    kg_co2e: Mapped[float] = mapped_column(Float)

    report: Mapped[FootprintReport] = relationship(back_populates="activities")