import {
  Box,
  Button,
  Center,
  chakra,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react";
import {
  Formik,
  Form as FormikForm,
  Field,
  FieldProps,
  FormikHelpers
} from "formik";
import { FaFacebook } from "react-icons/fa";
import { BiExit } from "react-icons/bi";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import * as Yup from "yup";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { login } from "../redux/features/user/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

// Give the components chakra props
export const FbIcon = chakra(FaFacebook);

interface Values {
  email: string;
  password: string;
}

// Give the components chakra props
const Form = chakra(FormikForm);
const ExitIcon = chakra(BiExit);
const VisibleEye = chakra(AiFillEye);
const InvisibleEye = chakra(AiFillEyeInvisible);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("Required")
  });

  const handleSubmit = async (
    values: Values,
    actions: FormikHelpers<Values>
  ) => {
    try {
      const res = await dispatch(
        login({ email: values.email, password: values.password })
      );
      unwrapResult(res);
      toast({
        title: "Successfully logged in",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top"
      });
    } catch (error) {
      console.log({ ...error });
      if (error.error === "Unauthorized") {
        toast({
          title: "The email or password you've entered is incorrect",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "top"
        });
        actions.setSubmitting(false);
      } else {
        toast({
          title: "An error occurred",
          status: "error",
          duration: 2500,
          isClosable: true,
          position: "top"
        });
        actions.setSubmitting(false);
      }
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {(props) => (
        <Center minH="100vh" minW="100vw">
          <Form
            action="/"
            w="100%"
            maxW="480px"
            px={6}
            pt={6}
            pb={12}
            boxShadow="lg"
            border="1px solid"
            borderColor="blackAlpha.100"
          >
            <VStack spacing={8}>
              <Link
                as={RouterLink}
                to="/"
                _hover={{ textDecoration: "none", color: "appPurple.600" }}
                fontWeight="bold"
                fontSize="lg"
                alignSelf="flex-start"
              >
                <Button>Quiz App</Button>
              </Link>
              <Heading
                fontSize="2xl"
                textTransform="uppercase"
                color="appPurple.500"
              >
                Login
              </Heading>
              <Field name="email">
                {({ field, form }: FieldProps<any, Values>) => (
                  <FormControl
                    w="100%"
                    isInvalid={
                      form.errors.email ? form.touched.email : undefined
                    }
                  >
                    {/* field: { name, value, onChange, onBlur } */}
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Email Address"
                      _placeholder={{
                        color: "gray.600"
                      }}
                      bg="blackAlpha.200"
                      py={7}
                      autoComplete="on"
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field, form }: FieldProps<any, Values>) => (
                  <FormControl
                    w="100%"
                    isInvalid={
                      form.errors.password ? form.touched.password : undefined
                    }
                  >
                    <InputGroup>
                      {/* field: { name, value, onChange, onBlur } */}
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        _placeholder={{
                          color: "gray.600"
                        }}
                        bg="blackAlpha.200"
                        py={7}
                        autoComplete="on"
                      />
                      <InputRightElement h="100%" mr={1}>
                        <IconButton
                          aria-label="Show or Hide password"
                          borderRadius="full"
                          colorScheme="appPurple"
                          variant="link"
                          size="sm"
                          icon={
                            showPassword ? (
                              <VisibleEye size={22} />
                            ) : (
                              <InvisibleEye size={22} />
                            )
                          }
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Flex justify="space-between" w="100%" fontWeight="500">
                <Checkbox colorScheme="appPurple" color="gray.700">
                  <Text fontSize={["0.9375rem", "1rem"]}>Remember me</Text>
                </Checkbox>
                <Link
                  color="appPurple.500"
                  textDecoration={["underline", "none"]}
                  fontSize={["0.9375rem", "1rem"]}
                >
                  <Text>Forgot Password?</Text>
                </Link>
              </Flex>
              <Button
                type="submit"
                isLoading={props.isSubmitting}
                textTransform="uppercase"
                w="100%"
                colorScheme="appPurple"
                py={[6, 7]}
                fontWeight="700"
              >
                <ExitIcon size={26} flex={1} />
                <Text flex={6} px={1}>
                  Login
                </Text>
                <Box visibility="hidden" flex={1} />
              </Button>
              <Link w="100%" _hover={{ textDecoration: "none" }}>
                <Button
                  textTransform="uppercase"
                  colorScheme="facebook"
                  w="100%"
                  py={[6, 7]}
                  fontWeight="700"
                >
                  <FbIcon size={26} flex={1} />
                  <Text flex={8} pl={2}>
                    Login with Facebook
                  </Text>

                  <Box
                    visibility="hidden"
                    flex={1}
                    d={{ base: "none", mobileM: "block" }}
                  />
                </Button>
              </Link>
              <Text alignSelf="flex-start">
                Don't have an account?{" "}
                <Link
                  as={RouterLink}
                  to="/signup"
                  _hover={{ textDecoration: "none", color: "appPurple.600" }}
                  _active={{ color: "appPurple.700" }}
                  color="appPurple.500"
                  fontWeight="bold"
                  ml={2}
                >
                  Sign Up
                </Link>
              </Text>
            </VStack>
          </Form>
        </Center>
      )}
    </Formik>
  );
};

export default Login;
