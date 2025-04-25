import { z } from "zod";

const createSpecialties=z.object({
title:z.string({
    required_error:"title is required"
})
});

export const SpecialtiesValidation={
createSpecialties
};