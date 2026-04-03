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

interface VendorAssignedEmailProps {
  vendorName: string
  requestTitle: string
  unitNumber: string
  propertyName: string
  requestId: string
}

export const VendorAssignedEmail = ({
  vendorName,
  requestTitle,
  unitNumber,
  propertyName,
  requestId,
}: VendorAssignedEmailProps) => (
  <Html>
    <Head />
    <Preview>New maintenance request assigned to you: {requestTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Assignment</Heading>
        <Text style={text}>Hi {vendorName},</Text>
        <Text style={text}>
          You have been assigned to a new maintenance request:
        </Text>
        <Section style={infoSection}>
          <Text style={infoText}><strong>Property:</strong> {propertyName}</Text>
          <Text style={infoText}><strong>Unit:</strong> {unitNumber}</Text>
          <Text style={infoText}><strong>Issue:</strong> {requestTitle}</Text>
        </Section>
        <Text style={text}>
          Please log in to the portal to view full details and update the status. Reference ID: {requestId}
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

const infoSection = {
  margin: "32px 48px",
  padding: "16px",
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
}

const infoText = {
  margin: "8px 0",
  fontSize: "16px",
  color: "#333",
}

export default VendorAssignedEmail
