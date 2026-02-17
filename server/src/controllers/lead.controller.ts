import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. Crear un nuevo Lead (Guardar en la base de datos)
export const createLead = async (req: Request, res: Response) => {
  try {
    // Sacamos los datos que nos enviará el usuario desde el formulario
    const { name, email, phone, source } = req.body;

    // Le decimos a Prisma que lo guarde en la tabla "Lead"
    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        source,
        // No pasamos 'status' porque Prisma le pondrá "NUEVO" por defecto
      },
    });

    res.status(201).json(newLead); // Respondemos con el lead creado
  } catch (error) {
    console.error("Error al crear lead:", error);
    res.status(500).json({ message: "Hubo un error al guardar el prospecto" });
  }
};

// 2. Obtener todos los Leads (Para mostrarlos en la tabla)
export const getLeads = async (req: Request, res: Response) => {
  try {
    // Le pedimos a Prisma TODOS los leads, ordenados por los más recientes
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc", // "desc" = descendente (del más nuevo al más viejo)
      },
    });

    res.json(leads); // Se los enviamos al Frontend
  } catch (error) {
    console.error("Error al obtener leads:", error);
    res.status(500).json({ message: "Hubo un error al cargar los prospectos" });
  }
};

// 3. Función para ELIMINAR un Lead
export const deleteLead = async (req: Request, res: Response) => {
  try {
    // Extraemos el ID que viene en la URL (ej: /api/leads/5)
    const { id } = req.params;

    // Le decimos a Prisma que busque y destruya ese registro
    // Nota: Convertimos el 'id' a Número porque de la URL siempre llega como Texto
    await prisma.lead.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({ message: "Prospecto eliminado correctamente 🗑️" });
  } catch (error) {
    console.error("Error al eliminar lead:", error);
    res.status(500).json({ message: "Hubo un error al eliminar el prospecto" });
  }
};