'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPhone, FiUser, FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { maskCPF } from '@/lib/masks/cpf';
import { formatBrazilianPhone } from '@/lib/masks/phone';
import { validateCPF } from '@/lib/validations/cpf';
import { validateBrazilianPhone } from '@/lib/validations/phone';
import { whatsappService } from '@/lib/services/whatsapp.service';
import logger from '@/lib/logger';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    allowCommunication: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });
  const [validations, setValidations] = useState({
    cpf: {
      isValid: true,
      isFull: false,
    },
    phoneNumber: {
      isValid: true,
      isFull: false,
    },
  });
  const [phoneIcon, setPhoneIcon] = useState<'phone' | 'whatsapp'>('phone');

  // Verifica se todos os requisitos da senha foram atendidos
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(Boolean);
  };

  const cleanCPF = (cpf: string) => cpf.replace(/[^\d]/g, '');
  const cleanPhone = (phone: string) => phone.replace(/[^\d]/g, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Lida com checkboxes e inputs normais
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Aplicar máscara de CPF
    if (name === 'cpf') {
      // Permitir apenas números
      const numericValue = value.replace(/\D/g, '');
      const maskedCPF = maskCPF(numericValue);

      setFormData({
        ...formData,
        [name]: maskedCPF,
      });

      // Validar apenas quando chegar a 11 dígitos
      setValidations((prev) => ({
        ...prev,
        cpf: {
          isFull: numericValue.length === 11,
          isValid: numericValue.length !== 11 || validateCPF(numericValue),
        },
      }));

      return;
    }

    // Aplicar máscara de telefone
    if (name === 'phoneNumber') {
      const maskedPhone = formatBrazilianPhone(value);
      const cleanedPhone = cleanPhone(maskedPhone);

      setFormData({
        ...formData,
        [name]: maskedPhone,
      });

      // Validar apenas quando chegar a 10 ou 11 dígitos
      setValidations((prev) => ({
        ...prev,
        phoneNumber: {
          isFull: [10, 11].includes(cleanedPhone.length),
          isValid: ![10, 11].includes(cleanedPhone.length) || validateBrazilianPhone(cleanedPhone),
        },
      }));

      return;
    }

    if (name === 'password') {
      validatePassword(value);
      setShowPasswordValidation(true);
    }
  };

  // Manipulador de evento para quando o usuário sair do campo de telefone
  const handlePhoneBlur = () => {
    const cleanedPhone = cleanPhone(formData.phoneNumber);

    // Verificar WhatsApp apenas quando o número estiver completo (10 ou 11 dígitos)
    if ([10, 11].includes(cleanedPhone.length)) {
      checkWhatsappNumber(cleanedPhone);
    }
  };

  // Função para verificar número de WhatsApp
  const checkWhatsappNumber = async (phone: string) => {
    try {
      const result = await whatsappService.checkWhatsappNumber(phone);

      // Atualiza o ícone se for WhatsApp
      if (result.isWhatsapp) {
        setPhoneIcon('whatsapp');
      }
    } catch (error) {
      logger.error('Erro ao verificar WhatsApp:', error);
    }
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    // Só esconde a validação se todos os requisitos forem atendidos
    if (Object.values(passwordRequirements).every(Boolean)) {
      setShowPasswordValidation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validação de CPF
    const cleanedCPF = cleanCPF(formData.cpf);
    if (cleanedCPF.length === 11 && !validateCPF(cleanedCPF)) {
      setError('CPF inválido');
      setIsLoading(false);
      return;
    }

    // Validação de telefone
    const cleanedPhone = cleanPhone(formData.phoneNumber);
    if ([10, 11].includes(cleanedPhone.length)) {
      if (!validateBrazilianPhone(cleanedPhone)) {
        setError('Número de telefone inválido');
        setIsLoading(false);
        return;
      }
    }

    // Validação de senha
    if (!passwordRequirements.minLength) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (
      !passwordRequirements.hasUpperCase ||
      !passwordRequirements.hasLowerCase ||
      !passwordRequirements.hasNumber
    ) {
      setError('A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const { fullName, cpf, phoneNumber, email, password, allowCommunication } = formData;

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          cpf: cleanCPF(cpf),
          phoneNumber,
          email,
          password,
          allowEmailCommunication: allowCommunication,
          allowWhatsappCommunication: allowCommunication,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar conta');
      }

      // Redirecionar para a página de login após o registro bem-sucedido
      router.push('/signin?registered=true');
    } catch (error) {
      // Log de erro no lado do cliente sem expor dados sensíveis
      logger.error('Erro no registro', {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        // Não inclua dados sensíveis aqui
      });

      setError(error instanceof Error ? error.message : 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mt-8 px-3 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="transform bg-white px-4 py-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800 sm:rounded-lg sm:px-10">
          {error && (
            <div className="animate-fadeIn mb-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            </div>
          )}
          <div className="pb-8 sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 transition-colors duration-200 dark:text-white">
              Criar Conta
            </h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
              >
                Nome Completo
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiUser className="h-5 w-5 text-gray-400 transition-colors duration-200 dark:text-gray-500" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  tabIndex={1}
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full rounded-md border-2 border-gray-300 bg-white py-3 pl-10 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="cpf"
                className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
              >
                CPF
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiUser className="h-5 w-5 text-gray-400 transition-colors duration-200 dark:text-gray-500" />
                </div>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                  autoComplete="off"
                  required
                  tabIndex={2}
                  value={formData.cpf}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-2 border-gray-300 bg-white py-3 pl-10 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm ${validations.cpf.isFull && !validations.cpf.isValid ? 'border-red-500' : ''}`}
                  placeholder="000.000.000-00"
                />
              </div>
              {validations.cpf.isFull && !validations.cpf.isValid && (
                <div className="mt-2">
                  <p className="text-sm text-red-600 dark:text-red-400">CPF inválido</p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
              >
                Número de Telefone
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {phoneIcon === 'phone' ? (
                    <FiPhone className="h-5 w-5 text-gray-400 transition-colors duration-200 dark:text-gray-500" />
                  ) : (
                    <FaWhatsapp className="h-5 w-5 text-[#25D366] transition-colors duration-200" />
                  )}
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  pattern="\(\d{2}\)\s\d{4,5}-\d{4}"
                  autoComplete="phoneNumber"
                  required
                  tabIndex={3}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handlePhoneBlur}
                  className={`block w-full rounded-md border-2 border-gray-300 bg-white py-3 pl-10 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm ${validations.phoneNumber.isFull && !validations.phoneNumber.isValid ? 'border-red-500' : ''}`}
                  placeholder="(00) 00000-0000"
                />
              </div>
              {validations.phoneNumber.isFull && !validations.phoneNumber.isValid && (
                <div className="mt-2">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Número de telefone inválido
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
              >
                Email
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiMail className="h-5 w-5 text-gray-400 transition-colors duration-200 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  tabIndex={4}
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-2 border-gray-300 bg-white py-3 pl-10 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
              >
                Senha
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-gray-400 transition-colors duration-200 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  tabIndex={5}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => {
                    setIsPasswordFocused(true);
                    setShowPasswordValidation(true);
                  }}
                  onBlur={handlePasswordBlur}
                  className="block w-full rounded-md border-2 border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm"
                  placeholder="********"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 cursor-pointer text-gray-400 transition-colors hover:text-gray-500 dark:hover:text-gray-300" />
                  ) : (
                    <FiEye className="h-5 w-5 cursor-pointer text-gray-400 transition-colors hover:text-gray-500 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {(isPasswordFocused || showPasswordValidation) && formData.password && (
                <div className="mt-2 space-y-1">
                  <p
                    className={`flex items-center gap-2 text-sm ${
                      passwordRequirements.minLength
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full ${
                        passwordRequirements.minLength
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                      } flex items-center justify-center`}
                    >
                      {passwordRequirements.minLength ? '✓' : '×'}
                    </span>
                    Mínimo de 6 caracteres
                  </p>
                  <p
                    className={`flex items-center gap-2 text-sm ${
                      passwordRequirements.hasUpperCase
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full ${
                        passwordRequirements.hasUpperCase
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                      } flex items-center justify-center`}
                    >
                      {passwordRequirements.hasUpperCase ? '✓' : '×'}
                    </span>
                    Uma letra maiúscula
                  </p>
                  <p
                    className={`flex items-center gap-2 text-sm ${
                      passwordRequirements.hasLowerCase
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full ${
                        passwordRequirements.hasLowerCase
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                      } flex items-center justify-center`}
                    >
                      {passwordRequirements.hasLowerCase ? '✓' : '×'}
                    </span>
                    Uma letra minúscula
                  </p>
                  <p
                    className={`flex items-center gap-2 text-sm ${
                      passwordRequirements.hasNumber
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full ${
                        passwordRequirements.hasNumber
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                      } flex items-center justify-center`}
                    >
                      {passwordRequirements.hasNumber ? '✓' : '×'}
                    </span>
                    Um número
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 transition-colors duration-200 dark:text-gray-300"
              >
                Confirmar Senha
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiLock className="h-5 w-5 text-gray-400 transition-colors duration-200 dark:text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  tabIndex={6}
                  disabled={!isPasswordValid}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                  className={`block w-full rounded-md border-2 border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:hover:border-gray-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 sm:text-sm ${!isPasswordValid ? 'cursor-not-allowed opacity-50' : ''}`}
                  placeholder="********"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={!isPasswordValid}
                  className={`absolute inset-y-0 right-0 flex items-center pr-3 ${!isPasswordValid ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 cursor-pointer text-gray-400 transition-colors hover:text-gray-500 dark:hover:text-gray-300" />
                  ) : (
                    <FiEye className="h-5 w-5 cursor-pointer text-gray-400 transition-colors hover:text-gray-500 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
              {isConfirmPasswordFocused && formData.confirmPassword && formData.password && (
                <div className="mt-2">
                  <p
                    className={`flex items-center gap-2 text-sm ${
                      formData.password === formData.confirmPassword
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full ${
                        formData.password === formData.confirmPassword
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                      } flex items-center justify-center`}
                    >
                      {formData.password === formData.confirmPassword ? '✓' : '×'}
                    </span>
                    As senhas coincidem
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="allowCommunication"
                name="allowCommunication"
                type="checkbox"
                tabIndex={7}
                checked={formData.allowCommunication}
                onChange={handleChange}
              />
              <label
                htmlFor="allowCommunication"
                className="py-2 text-xs text-gray-600 dark:text-gray-400"
              >
                Concordo em receber mensagens no WhatsApp e e-mails sobre os eventos da DSUSP de
                acordo com a{' '}
                <Link
                  href="/politica-de-privacidade"
                  target="_blank"
                  className="text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Política de Privacidade
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                tabIndex={8}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Criar Conta'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <Link
                href="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
