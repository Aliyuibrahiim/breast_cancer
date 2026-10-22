import { pgTable, uuid, varchar, timestamp, boolean, pgEnum, text } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "doctor"]);
export const genderEnum = pgEnum("gender", ["female", "male", "other"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    role: roleEnum("role").default("doctor").notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    verifyToken: varchar("verify_token", { length: 255 }),
    verifyTokenExpiry: timestamp("verify_token_expiry"),
    resetPasswordToken: varchar("reset_password_token", { length: 255 }),
    resetPasswordExpire: timestamp("reset_password_expire"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const patients = pgTable("patients", {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    dateOfBirth: timestamp("date_of_birth"),
    gender: genderEnum("gender").notNull(),
    contactNumber: varchar("contact_number", { length: 50 }),
    email: varchar("email", { length: 255 }),
    address: text("address"),
    medicalHistory: text("medical_history"),
    assignedDoctorId: uuid("assigned_doctor_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const diagnosisEnum = pgEnum("diagnosis_result", ["benign", "malignant"]);

export const diagnostics = pgTable("diagnostics", {
    id: uuid("id").defaultRandom().primaryKey(),
    patientId: uuid("patient_id").references(() => patients.id, { onDelete: 'cascade' }).notNull(),
    doctorId: uuid("doctor_id").references(() => users.id),
    predictionResult: diagnosisEnum("prediction_result").notNull(),
    confidenceScore: varchar("confidence_score", { length: 50 }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

import { relations } from "drizzle-orm";

export const patientsRelations = relations(patients, ({ many }) => ({
    diagnostics: many(diagnostics),
}));

export const diagnosticsRelations = relations(diagnostics, ({ one }) => ({
    patient: one(patients, {
        fields: [diagnostics.patientId],
        references: [patients.id],
    }),
}));
