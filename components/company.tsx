"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X, Check } from "lucide-react"
import { api } from "@/api/api"

interface Plan {
  id: string
  name: string
  price: string
  description: string
  limit: string
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "Gratuito",
    description: "Ideal para começar",
    limit: "5k métricas/logs",
  },
  {
    id: "basic",
    name: "Basic",
    price: "R$ 79,90",
    description: "Para pequenos projetos",
    limit: "100k métricas/logs",
  },
  {
    id: "complete",
    name: "Complete",
    price: "R$ 79,90",
    description: "Para empresas",
    limit: "250k métricas/  logs",
  },
]

export function SignupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "qrcode">("form")
  const [selectedPlan, setSelectedPlan] = useState<string>("free")
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    documentNumber: "",
    contactPhone: "",
    contactEmail: "",
    plan: "",
    countAlerts: 5000,
  })

  const [qrValue, setQrValue] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Gera o QR code com dados da empresa e plano
    // chama o backend e gera o qrcode

    const response = await api.post('/companies/pay', {
      plan: selectedPlan,
    })

    setQrValue(response.data.qrcode)
    setStep("qrcode")
  }

  const handleReset = () => {
    setStep("form")
    setFormData({ companyName: "", email: "", phone: "" })
    setSelectedPlan("free")
    setQrValue("")
  }

  async function getCompany() {
    const response = await api.get('/companies/me');
    setFormData({
      id: response.data.id,
      name: response.data.name,
      documentNumber: response.data.documentNumber,
      contactPhone: response.data.contactPhone,
      contactEmail: response.data.contactEmail,
      countAlerts: response.data.countAlerts,
      plan: response.data.plan,
    });

    setSelectedPlan(response.data.plan);
  }

  useEffect(() => {
    getCompany()
  }, [])

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${isOpen ? "block" : "hidden"}`}>
      <div className="bg-background border border-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background">
          <h2 className="text-2xl font-bold">Cadastre sua Empresa</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === "form" ? (
            // FORM STEP
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-6">Informações da Empresa</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nome da Empresa</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Sua empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Documento</label>
                    <input
                      type="text"
                      required
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="47.767.608/0001-00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Telefone</label>
                    <input
                      type="tel"
                      required
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Alert Limit Metrics/logs</label>
                    <input
                      type="number"
                      required
                      value={formData.countAlerts}
                      onChange={(e) => setFormData({ ...formData, countAlerts: +e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </form>
              </div>

              {/* Plan Selection */}
              <div>
                <h3 className="text-xl font-bold mb-6">Escolha seu Plano</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${selectedPlan === plan.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{plan.name}</h4>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                          <p className="text-xs font-semibold text-primary mt-2">{plan.limit}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${selectedPlan === plan.id ? "border-primary bg-primary" : "border-border"
                            }`}
                        >
                          {selectedPlan === plan.id && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-primary">{plan.price}</p>
                      <p className="text-xs text-muted-foreground mt-2">/mês</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
                >
                  Cancelar
                </button>
                {formData.plan == 'free' && (
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Gerar QR Code
                  </button>
                )}

              </div>
            </div>
          ) : (
            // QR CODE STEP
            <div className="space-y-8 flex flex-col items-center">
              <div className="text-center">
                <div className="inline-block mb-6">
                  <div className="bg-primary/10 rounded-full p-3 mb-4">
                    <Check className="w-8 h-8 text-primary mx-auto" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Perfeito!</h3>
                <p className="text-muted-foreground">Aqui está seu QR code para ativar a conta</p>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-border">
                {qrValue && (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                      qrValue
                    )}&size=200x200`}
                    alt="QR Code"
                  />
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4 w-full text-center">
                <p className="text-sm font-semibold mb-2">Plano selecionado</p>
                <p className="text-lg font-bold">{plans.find((p) => p.id === selectedPlan)?.name}</p>
                <p className="text-primary font-semibold">{plans.find((p) => p.id === selectedPlan)?.price}/mês</p>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-4">
                  Escaneie este QR code com seu telefone para confirmar o cadastro e ativar sua conta imediatamente.
                </p>
              </div>

              <div className="flex gap-4 w-full pt-4">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
                >
                  Voltar
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Concluído
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
