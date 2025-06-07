# Source Code Overview

This directory contains the source code for the authentication client application.

## Directory Structure

- **app.tsx**: Main application entry point using SolidJS
- **components/**: Shared components used across the application
- **devano/**: Component and utility library
  - **api/**: API integration utilities and endpoints
  - **atoms/**: Atomic UI components (buttons, inputs, layout, etc.)
  - **css/**: CSS styles and palette
  - **utils/**: Utility functions
- **flows/**: Feature-specific flows
  - **auth/**: Authentication flow (login, password reset)
  - **onboarding/**: User onboarding flow
- **global/**: Global context providers
- **routes/**: Application routes
- **types/**: TypeScript type definitions

## Adding New Features

### UI Components

1. For new UI components, check existing components in `devano/atoms/` first
2. Follow the component structure in the appropriate category (buttons, inputs, layout, etc.)
3. Use utility functions from `devano/utils/` for consistency

### New API Endpoints

1. Add new API handlers in the appropriate directory under `devano/api/`
2. Export them from the relevant index.ts file
3. Follow the pattern in `devano/api/index.ts` for exposing endpoints

### Authentication Features

1. For authentication-related features, add components to `flows/auth/`
2. Update the authentication context in `flows/auth/Context.tsx` if needed
3. Add new views in `flows/auth/views/`

### Onboarding Features

1. For onboarding-related features, add to `flows/onboarding/`
2. Create new screens in `flows/onboarding/screens/`
3. Update the onboarding controller in `flows/onboarding/Controller.tsx`

### Routes

1. Add new routes in the `routes/` directory
2. The application uses file-based routing with SolidJS Start

## Best Practices

- Maintain component modularity
- Use TypeScript types from the `types/` directory
- Organize related features within the appropriate flow directory
- Leverage existing utilities and components before creating new ones