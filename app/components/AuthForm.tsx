"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from "./CustomInput"
import { authFormSchema } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { login, signUp } from "@/lib/actions/user.actions"

const AuthForm = ({ type }: {type: string}) => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const formSchema = authFormSchema(type)

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: ""
      },
    })
   
    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof formSchema>)=> {
      setIsLoading(true)
      try {
        // Sign up with Appwrite & create plaid link token

        if(type === "sign-up") {
          const newUser = await signUp(data)
          setUser(newUser)
        }
        if (type === "login") {
          const response = await login({
            email: data.email,
            password: data.password,
          })
          if (response) router.push("/")
        }
        
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/"
              className="cursor-pointer flex items-center gap-1">
                  <Image
                      src="/icons/logo.svg"
                      width={34}
                      height={34}
                      alt="Horizon logo"
                  />
              <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
          </Link>
          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
              {user ? "Link Account" : type === "login" ? "Login" : "Sign Up"}
              <p className="text-16 font-normal text-gray-600">
                {user ? "Link your account to get started" : "Please enter your details"}
              </p>
            </h1>
          </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          {/* PlaidLink */}
        </div>
      ): 
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {type === "sign-up" && (
              <>
                <div className="flex gap-4">
                  <CustomInput
                    control={form.control} name="firstName" label="First Name" placeholder="Enter your first name"
                  />
                  <CustomInput
                    control={form.control} name="surname" label="Surname" placeholder="Enter your surname"
                  />
                </div>
                <CustomInput
                  control={form.control} name="address1" label="Address" placeholder="Enter the first line of your address"
                />
                <div className="flex gap-4">
                  <CustomInput
                    control={form.control} name="city" label="City" placeholder="Enter your city"
                  />
                  <CustomInput
                    control={form.control} name="postCode" label="Post Code" placeholder="Enter your post code"
                  />
                </div>
                <CustomInput
                  control={form.control} name="dateOfBirth" label="Date of Birth" placeholder="dd-mm-yyyy"
                />
              </>
            )}
            <CustomInput
              control={form.control} name="email" label="Email" placeholder="Enter your email"
            />
            <CustomInput
              control={form.control} name="password" label="Password" placeholder="Enter your password"
            />
            <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading}
              className="form-btn">
                {isLoading ? (
                  <>
                    <Loader2 size={20}
                      className="animate-spin"
                    /> &nbsp;
                    Loading...
                  </>
                ) : type === "login" ? "Login" : "Sign Up"}
              </Button>
            </div>
          </form>
        </Form>
        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">
            {type === "login" ?
            "Don't have an account?":
            "Already have an account?"}
          </p>
          <Link href={type === "login" ? "sign-up" : "login"}
            className="form-link">
          {type === "login" ? "Sign Up" : "Login"}
          </Link>
        </footer>
      </>}
    </section>
  )
}

export default AuthForm