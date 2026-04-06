"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"
import styled from "@emotion/styled"
import { Label } from "./label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = { name: TName }

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

function _FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}
const FormField: typeof _FormField = _FormField as any

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)
  if (!fieldContext) throw new Error("useFormField should be used within <FormField>")
  const { id } = itemContext
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = { id: string }
const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()
    return (
      <FormItemContext.Provider value={{ id }}>
        <StyledFormItem ref={ref} className={className} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

const StyledFormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()
  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      className={className}
      css={error ? `color: hsl(var(--destructive));` : undefined}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()
  return (
    <StyledDescription ref={ref} id={formDescriptionId} className={className} {...props} />
  )
})
FormDescription.displayName = "FormDescription"

const StyledDescription = styled.p`
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
`

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children
  if (!body) return null
  return (
    <StyledError ref={ref} id={formMessageId} className={className} {...props}>
      {body}
    </StyledError>
  )
})
FormMessage.displayName = "FormMessage"

const StyledError = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(var(--destructive));
`

export {
  useFormField, Form, FormItem, FormLabel, FormControl,
  FormDescription, FormMessage, FormField,
}