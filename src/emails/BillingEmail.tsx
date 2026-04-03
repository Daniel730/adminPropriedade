import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from "@react-email/components"
import * as React from "react"

interface BillingEmailProps {
  managerName: string
  eventType: "failed" | "resolved"
  gracePeriodEnd?: string
}

export const BillingEmail = ({
  managerName,
  eventType,
  gracePeriodEnd,
}: BillingEmailProps) => {
  const isFailed = eventType === "failed"

  return (
    <Html>
      <Head />
      <Preview>
        {isFailed
          ? "Payment Failed - Action Required"
          : "Payment Successful - Thank you"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={isFailed ? h1Error : h1Success}>
            {isFailed ? "Payment Failed" : "Payment Successful"}
          </Heading>
          <Text style={text}>Hi {managerName},</Text>
          <Text style={text}>
            {isFailed
              ? "Unfortunately, your latest subscription payment failed. To avoid service interruption, please update your payment method."
              : "Thank you! Your latest subscription payment was successful. Your account remains in good standing."}
          </Text>
          {isFailed && gracePeriodEnd && (
            <Section style={warningSection}>
              <Text style={warningText}>
                <strong>Grace Period:</strong> Your account will enter read-only mode after {gracePeriodEnd} if payment is not resolved.
              </Text>
            </Section>
          )}
          <Text style={text}>
            You can manage your subscription and payment methods in the Billing portal.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const h1Error = {
  color: "#dc3545",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
}

const h1Success = {
  color: "#28a745",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "left" as const,
  padding: "0 48px",
}

const warningSection = {
  margin: "32px 48px",
  padding: "16px",
  backgroundColor: "#fff3cd",
  border: "1px solid #ffeeba",
  borderRadius: "4px",
}

const warningText = {
  margin: "0",
  fontSize: "16px",
  color: "#856404",
}

export default BillingEmail
