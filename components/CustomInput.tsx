import React from 'react';
import { Control, FieldPath, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {z} from 'zod'
import { AuthFormSchema } from '@/lib/utils';

const formSchema = AuthFormSchema('sign-up');

interface CustomInput{
    control: Control<z.infer<typeof formSchema>>
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string, 
    placeholder: string 

}

const CustomInput = ({ control, name, label, placeholder }:CustomInput) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                type={name === 'password' ? 'password' : 'text'} // Adding the type here
                placeholder={placeholder}
                className="input-class"
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
