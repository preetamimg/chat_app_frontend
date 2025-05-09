import * as Yup from "yup";

export const groupValidationSchema = Yup.object().shape({

  groupName: Yup.string()
    .required("Group name is required"),

    participants : Yup.array().min(2)

});
