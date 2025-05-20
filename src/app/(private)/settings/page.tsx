"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo, {session?.user?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aqui você pode gerenciar suas atividades e acessar diferentes funcionalidades do sistema.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}