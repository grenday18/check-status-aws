import type { APIGatewayEvent } from "aws-lambda"

interface OrganizationAuth {
  legacyId: string
  id?: string
  applicationVersion?:
    | "colombia"
    | "mexico"
    | "republicaDominicana"
    | "panama"
    | "peru"
    | "usa"
    | "other"
    | "spain"
    | "chile"
    | "costaRica"
    | "argentina"
    | "southAfrica"
    | "nigeria"
    | "kenya"
}

interface RequestContext {
  userAgent: string
  sourceIp: string
}

interface UserAuth {
  legacyBasicToken: string
  email: string
  id: string
  token: string
  legacyId: string
}

interface IAuthContext {
  user?: UserAuth
  organization?: OrganizationAuth
  request?: RequestContext
  isPublic?: boolean
}

class AuthContext implements IAuthContext {
  user: UserAuth
  organization: OrganizationAuth
  request: RequestContext
  isPublic: boolean

  constructor(event: APIGatewayEvent | IAuthContext) {
    if ("requestContext" in event) {
      this.user = event.requestContext.authorizer["lambda"].user
      this.organization = event.requestContext.authorizer["lambda"].organization
      this.organization.applicationVersion = event.requestContext.authorizer["lambda"].applicationVersion
      this.request = {
        userAgent: event.requestContext["http"].userAgent,
        sourceIp: event.requestContext["http"].sourceIp
      }
      const headers = event?.headers
      this.isRequestFromAlegra(headers)

      if (!this.organization?.legacyId) {
        console.log("AUTH_COMPANY_ERROR", this)
        throw Error("AUTH_COMPANY_ERROR")
      }
    } else {
      Object.assign(this, event)
    }
  }

  isRequestFromAlegra(headers: any) {
    if (this.validateSourceFromHeaders(headers) && headers["access-key"] == process.env.ACCESSKEY) {
      this.isPublic = false
    } else {
      this.isPublic = true
    }
  }

  validateSourceFromHeaders(headers: string[]): boolean {
    const xDataSource = headers["x-data-source"] || null
    const xDataSourcesValids = [
      // Products
      "alegra-accountant",
      "alegra-accounting",
      "alegra-only-invoices",
      "alegra-payroll",
      "alegra-shops",
      "mobile-app",
      "pos",
      "pos-tablet",

      // Subdomains
      "alegra-items",
      "web"
    ]

    return xDataSource && xDataSourcesValids.includes(xDataSource)
  }
}

export default AuthContext
