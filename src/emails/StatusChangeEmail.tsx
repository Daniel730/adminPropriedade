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

interface StatusChangeEmailProps {
  tenantName: string
  requestTitle: string
  newStatus: string
  requestId: string
}

export const StatusChangeEmail = ({
  tenantName,
  requestTitle,
  newStatus,
  requestId,
}: StatusChangeEmailProps) => (
  <Html>
    <Head />
    <Preview>Status updated for your maintenance request: {requestTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Status Updated</Heading>
        <Text style={text}>Hi {tenantName},</Text>
        <Text style={text}>
          The status of your maintenance request <strong>{requestTitle}</strong> has been updated to:
        </Text>
        <Section style={statusSection}>
          <Text style={statusText}>{newStatus}</Text>
        </Section>
        <Text style={text}>
          You can track the progress of your request in the portal using ID: {requestId}
        </Text>
      </Container>
    </Body>
  </Html>
)

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

const h1 = {
  color: "#333",
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

const statusSection = {
  margin: "32px 48px",
  padding: "16px",
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  textAlign: "center" as const,
}

const statusText = {
  margin: "0",
  fontSize: "18px",
  fontWeight: "bold",
  color: "#007bff",
  textTransform: "uppercase" as const,
}

export default StatusChangeEmail
