# Context Engineering Template for Task Management Application

## Header Section

### Title
**AI-Assisted Task Management System Development Context Framework**

### Purpose
This template provides a comprehensive framework for engineering effective context when working with AI assistants on the task management application. It ensures consistent, high-quality interactions by structuring all necessary information components for optimal AI performance.

### Key Principles
1. **Completeness**: Include all relevant technical, business, and user context
2. **Specificity**: Provide precise details about the current system state and requirements
3. **Clarity**: Structure information in a logical, easily digestible format
4. **Consistency**: Maintain standardized context patterns across all interactions
5. **Relevance**: Focus on information directly applicable to the current task
6. **Scalability**: Design context that grows with system complexity

---

## Context Components Checklist

### 1. Instructions ✓
- [ ] **Primary Objective**: Clearly state what needs to be accomplished
- [ ] **Success Criteria**: Define measurable outcomes
- [ ] **Constraints**: Specify technical limitations, coding standards, and requirements
- [ ] **Preferences**: Indicate preferred approaches, patterns, or technologies
- [ ] **Scope**: Define boundaries of the task (what to include/exclude)

### 2. User Prompt ✓
- [ ] **Problem Statement**: Clear description of the issue or requirement
- [ ] **Context Background**: Why this task is needed
- [ ] **Expected Behavior**: How the solution should work
- [ ] **Examples**: Specific use cases or scenarios
- [ ] **Priority Level**: Urgency and importance classification

### 3. State/History ✓
- [ ] **Current System State**: What exists now
- [ ] **Recent Changes**: Previous modifications and their impact
- [ ] **Known Issues**: Existing bugs or limitations
- [ ] **Session History**: Previous related work in current session
- [ ] **Dependencies**: What this task depends on or affects

### 4. Long-term Memory ✓
- [ ] **Architecture Overview**: System design patterns and principles
- [ ] **Technology Stack**: Current technologies and versions
- [ ] **Coding Standards**: Established patterns and conventions
- [ ] **Business Rules**: Domain-specific logic and constraints
- [ ] **Team Preferences**: Established development practices

### 5. Retrieved Information ✓
- [ ] **Relevant Code**: Existing implementations to reference
- [ ] **Database Schema**: Current data model and relationships
- [ ] **API Documentation**: Available endpoints and interfaces
- [ ] **Configuration**: Environment and setup details
- [ ] **External Dependencies**: Third-party services and libraries

### 6. Available Tools ✓
- [ ] **Development Tools**: IDEs, debuggers, testing frameworks
- [ ] **Build System**: Compilation, bundling, and deployment tools
- [ ] **Version Control**: Git workflows and branching strategies
- [ ] **Database Tools**: Migration, seeding, and administration
- [ ] **Monitoring**: Logging, analytics, and error tracking

### 7. Structured Output ✓
- [ ] **Response Format**: Expected structure of AI responses
- [ ] **Code Standards**: Formatting, documentation, and testing requirements
- [ ] **Deliverables**: Specific files, functions, or components to create
- [ ] **Review Criteria**: What constitutes a complete and correct solution
- [ ] **Follow-up Actions**: Next steps after task completion

---

## Planning Framework

### Step 1: Requirement Analysis
1. **Understand the Problem**
   - Read and analyze the user request
   - Identify the core business need
   - Determine technical requirements
   - Assess impact on existing system

2. **Gather Context Information**
   - Review current application state
   - Examine related code and components
   - Check database schema and models
   - Identify affected user flows

3. **Define Success Criteria**
   - Functional requirements
   - Performance expectations
   - User experience goals
   - Security considerations

### Step 2: Technical Planning
1. **Architecture Assessment**
   - Current: Next.js 15 App Router, Supabase, TypeScript, Tailwind CSS
   - Components: React 19 Server/Client Components, shadcn/ui
   - Database: PostgreSQL with comprehensive RLS policies
   - Authentication: Supabase Auth with role-based access
   - Status System: Dual system (custom + traditional) with automatic synchronization
   - UI Framework: Custom CSS with Tailwind, Geist font, next-themes

2. **Implementation Strategy**
   - Identify required changes to existing code
   - Plan new component creation
   - Consider database schema updates
   - Plan testing approach
   - Consider impact on dual status systems
   - Maintain interactive features (inline editing, global undo)

3. **Risk Assessment**
   - Breaking changes impact
   - Security implications
   - Performance considerations
   - User experience effects
   - Status system compatibility
   - Interactive feature preservation

### Step 3: Context Assembly
1. **System Context**
   ```
   Application: Task Management System
   Stack: Next.js 15, React 19, Supabase, TypeScript, Tailwind CSS
   UI: shadcn/ui components with New York style
   Database: PostgreSQL with comprehensive RLS policies
   Authentication: Supabase Auth with admin/member roles
   Status Systems: Dual system (custom + traditional) with auto-sync
   ```

2. **Current Architecture**
   ```
   /app - Next.js App Router pages
   /components - Reusable UI components with interactive features
   /lib - Database operations, types, utilities, status system
   /middleware.ts - Supabase auth middleware
   Key Features: Tasks, Projects, Users, Comments, Attachments, Tags
   Advanced Features: Inline editing, global undo, dual status system
   ```

3. **Development Context**
   ```
   Conventions: Server components by default, 'use client' when needed
   Styling: Custom CSS with Tailwind classes, Geist font, CSS variables
   Forms: react-hook-form with zod validation
   State: Server state via Supabase, client state with useState/useEffect
   Status System: Custom (urgent/priority_2/priority_3/done) + Traditional (todo/in_progress/done + priority levels)
   Interactive Features: Click-to-edit status/dates, global undo system
   Theme: Dark/light mode support with next-themes
   Icons: Lucide React icons, custom SVG components
   UI Components: shadcn/ui with Radix UI primitives
   ```

### Step 4: Quality Validation
1. **Completeness Check**: All required context components included
2. **Accuracy Verification**: Information is current and correct
3. **Relevance Assessment**: Context directly applies to the task
4. **Clarity Review**: Information is clearly structured and understandable

---

## Current System State (Updated January 2025)

### Core Features
- **Task Management**: Full CRUD operations with dual status system
- **Project Organization**: Projects with member management
- **User Management**: Role-based access (admin/member)
- **Interactive UI**: Inline editing, global undo, real-time updates
- **Status Systems**: Custom status system + traditional status + priority levels with automatic synchronization
- **Advanced Components**: Task board, task cards, filters, view toggles
- **Authentication**: Complete Supabase auth flow with protected routes
- **Theme Support**: Dark/light mode with next-themes

### Database Schema (Current)
```sql
-- Core tables
tasks (id, title, description, status, traditional_status, priority, priority_level, due_date, project_id, created_by, created_at, updated_at)
projects (id, name, description, color, created_by, created_at, updated_at)
users (id, email, full_name, avatar_url, role, created_at, updated_at)

-- Relationship tables
task_assignments (id, task_id, user_id, assigned_at)
project_members (id, project_id, user_id, role, joined_at)
comments (id, content, task_id, user_id, created_at, updated_at)
attachments (id, filename, file_path, file_size, mime_type, task_id, uploaded_by, created_at)
tags (id, name, color, created_at)
task_tags (id, task_id, tag_id)
notifications (id, type, title, message, user_id, task_id, read, created_at)
activity_log (id, action, entity_type, entity_id, user_id, changes, created_at)

-- Status system synchronization
sync_task_status_systems() - trigger function for automatic status sync
update_updated_at_column() - automatic timestamp updates
```

### Key Files and Components
```
lib/types/index.ts - Comprehensive type definitions with dual status support
lib/utils/status-system.ts - 20+ utility functions for status management
lib/database/tasks.ts - Enhanced database operations with dual status support
lib/database/projects.ts - Project management operations
lib/database/users.ts - User management operations
lib/actions/tasks.ts - Server actions with specialized status operations
lib/supabase/ - Supabase client, server, and middleware utilities
contexts/undo-context.tsx - Global undo system context

components/tasks/
├── inline-status-editor.tsx - Click-to-edit status functionality
├── inline-date-editor.tsx - Click-to-edit date functionality
├── task-card.tsx - Enhanced task cards with interactive features
├── task-board.tsx - Board view with real-time updates
├── tasks-view.tsx - List/board view toggle
├── task-view-toggle.tsx - View switching component
├── create-task-button.tsx - Task creation trigger
├── create-task-dialog.tsx - Task creation modal
├── create-task-form.tsx - Task creation form with status system integration
├── task-row.tsx - List view task representation
├── undo-toast.tsx - Global undo system
└── task-filters.tsx - Advanced filtering options

components/dashboard/
├── header-icons.tsx - Dashboard header icons
├── nav.tsx - Dashboard navigation
└── user-nav.tsx - User navigation component

app/dashboard/
├── layout.tsx - Dashboard layout
├── page.tsx - Dashboard home
├── tasks/page.tsx - Tasks page with filters and views
├── projects/page.tsx - Projects management
├── team/page.tsx - Team management
└── favorites/page.tsx - Favorites view
```

### Status System Details
```typescript
// Custom Status System (Primary)
type CustomStatus = 'urgent' | 'priority_2' | 'priority_3' | 'done';

// Traditional Status System (Secondary)
type TraditionalStatus = 'todo' | 'in_progress' | 'done';
type PriorityLevel = 1 | 2 | 3 | 4; // Low, Medium, High, Urgent

// Automatic conversion between systems via database triggers
// Comprehensive utility functions for status management, filtering, sorting
// Interactive inline editing with real-time updates
// Global undo system for all status changes
// Type guards and conversion utilities
// Status-based filtering and dashboard counts
```

---

## Quality Assessment Criteria

### Context Quality Metrics
- **Completeness Score**: 7/7 context components addressed
- **Detail Level**: Sufficient depth without overwhelming information
- **Accuracy Rate**: Information reflects current system state
- **Relevance Rating**: Direct applicability to the current task
- **Clarity Index**: Information is well-organized and understandable

### Validation Checklist
- [ ] All 7 context components are present and complete
- [ ] Technical details match current system implementation
- [ ] Business requirements are clearly defined
- [ ] Constraints and limitations are specified
- [ ] Success criteria are measurable
- [ ] Expected output format is defined
- [ ] Relevant code examples are included
- [ ] Database schema information is current
- [ ] Authentication/authorization context is provided
- [ ] UI/UX guidelines are specified
- [ ] **NEW**: Status system compatibility is considered
- [ ] **NEW**: Interactive feature requirements are specified

---

## Example Scenarios

### Scenario 1: Adding New Task Feature
**Context Template:**
```
INSTRUCTIONS:
- Add a new "Task Dependencies" feature to allow tasks to depend on other tasks
- Implement UI for managing dependencies in task creation/edit forms
- Ensure proper validation and error handling
- Follow existing code patterns and UI design
- Consider impact on both status systems

USER PROMPT:
"I need to add task dependencies so users can specify that one task must be completed before another can start."

STATE/HISTORY:
- Current task system supports: dual status system, inline editing, global undo
- Database schema has tasks table with custom and traditional status fields
- UI uses CreateTaskDialog and CreateTaskForm components with status system integration
- Task filtering and board/list views are implemented with interactive features
- Status system utilities available in lib/utils/status-system.ts

LONG-TERM MEMORY:
- Architecture: Next.js 15 App Router with TypeScript, React 19
- Database: Supabase PostgreSQL with RLS and status sync triggers
- UI: shadcn/ui components with custom CSS variables and interactive features
- Pattern: Server actions for mutations, server components for data fetching
- Status System: Dual system with automatic synchronization

RETRIEVED INFORMATION:
- lib/database/schema.sql - current database structure with dual status support
- lib/types/index.ts - TypeScript interfaces with status system types
- components/tasks/create-task-form.tsx - task creation UI with status integration
- lib/database/tasks.ts - task database operations with dual status support
- lib/utils/status-system.ts - status system utility functions
- contexts/undo-context.tsx - global undo system implementation
- app/dashboard/tasks/page.tsx - main tasks page with filters and views

AVAILABLE TOOLS:
- File system tools for reading/writing code
- Database exploration tools
- Search tools for exploring existing patterns
- Development server for testing changes

STRUCTURED OUTPUT:
1. Database migration for task_dependencies table
2. Updated TypeScript types with dependency support
3. Modified task creation/edit forms with dependency UI
4. Updated task database operations with dependency logic
5. UI components for dependency visualization
6. Status system integration for dependency validation
```

### Scenario 2: Performance Optimization
**Context Template:**
```
INSTRUCTIONS:
- Optimize task loading performance on the dashboard
- Implement pagination or virtualization for large task lists
- Maintain current functionality including interactive features
- Use existing technology stack and status system utilities

USER PROMPT:
"The task list is loading slowly when users have many tasks. We need to improve performance while keeping inline editing and undo functionality."

STATE/HISTORY:
- Current implementation loads all tasks with dual status system support
- getTasks function in lib/database/tasks.ts handles filtering with status utilities
- TasksView component renders all tasks with interactive features
- Inline editing and global undo system are performance-sensitive
- Status system utilities provide efficient filtering and sorting

LONG-TERM MEMORY:
- Performance: Prefer server-side optimizations, maintain interactive features
- UI: Maintain current list/board view functionality with inline editing
- Data: Supabase PostgreSQL with proper indexing and status sync
- Caching: Next.js automatic caching for server components
- Status System: Efficient filtering using status system utilities

RETRIEVED INFORMATION:
- lib/database/tasks.ts - current task fetching with dual status support
- components/tasks/tasks-view.tsx - task rendering with interactive features
- components/tasks/task-card.tsx - individual task card components
- app/dashboard/tasks/page.tsx - page implementation with filters
- lib/utils/status-system.ts - performance-optimized status utilities
- Database indexes on tasks table including status fields
- contexts/undo-context.tsx - performance considerations for undo system

STRUCTURED OUTPUT:
1. Pagination implementation in getTasks function with status filtering
2. Updated TasksView component with loading states and interactive features
3. Infinite scroll or pagination UI components
4. Database query optimization using status system indexes
5. Performance monitoring for interactive features
```

### Scenario 3: Security Enhancement
**Context Template:**
```
INSTRUCTIONS:
- Implement additional RLS policies for enhanced security
- Ensure project members can only access their project's tasks
- Add audit logging for sensitive operations including status changes
- Follow security best practices while maintaining status system functionality

USER PROMPT:
"We need to strengthen security so users can only see tasks from projects they're members of, and track all status changes."

STATE/HISTORY:
- Current RLS policies provide basic task access control
- Project membership system exists with admin/member roles
- Dual status system with automatic synchronization
- Activity logging exists but may need enhancement for status changes
- Status system utilities handle access control efficiently

LONG-TERM MEMORY:
- Security: Row Level Security (RLS) is primary access control
- Architecture: Supabase handles authentication and authorization
- Patterns: Policy-based access control, server-side validation
- Compliance: Need audit trail for security operations and status changes
- Status System: Both status systems need security consideration

RETRIEVED INFORMATION:
- lib/database/schema.sql - current RLS policies and status sync triggers
- middleware.ts - Supabase authentication middleware
- lib/supabase/ - client, server, and middleware utilities
- Project membership implementation in lib/database/projects.ts
- Activity logging system in database schema
- lib/utils/status-system.ts - status system utilities with security considerations
- app/dashboard/layout.tsx - protected route implementation

STRUCTURED OUTPUT:
1. Updated RLS policies for enhanced task access with status system support
2. Project membership validation improvements
3. Enhanced audit logging system for status changes
4. Security testing recommendations for dual status system
5. Documentation updates for security model including status system
```

### Scenario 4: Status System Enhancement (NEW)
**Context Template:**
```
INSTRUCTIONS:
- Enhance the dual status system with new priority-based workflows
- Add status transition validation and business rules
- Implement status history tracking
- Maintain backward compatibility with existing system

USER PROMPT:
"We need to add workflow rules so tasks can only transition between certain statuses, and track the history of all status changes."

STATE/HISTORY:
- Dual status system implemented with automatic synchronization
- Custom status: urgent/priority_2/priority_3/done
- Traditional status: todo/in_progress/done + priority levels (1-4)
- Status system utilities provide conversion and validation
- Database triggers handle automatic synchronization
- Interactive status editing via inline-status-editor component

LONG-TERM MEMORY:
- Status System: Dual system with bidirectional synchronization
- Architecture: Database triggers maintain consistency
- UI: Inline editing with real-time updates
- Utilities: Comprehensive status system functions in lib/utils/status-system.ts
- Types: Full TypeScript support for both status systems

RETRIEVED INFORMATION:
- lib/utils/status-system.ts - existing status system utilities
- lib/types/index.ts - status system type definitions
- lib/database/schema.sql - current database schema with triggers
- components/tasks/inline-status-editor.tsx - status editing UI
- Database triggers for status synchronization
- contexts/undo-context.tsx - undo system for status changes
- PHASE_5_COMPLETION_SUMMARY.md - recent testing and validation results

STRUCTURED OUTPUT:
1. Enhanced status transition validation in database triggers
2. Status history tracking table and migration
3. Updated status system utilities with workflow rules
4. Enhanced inline status editor with transition validation
5. Status history UI components
6. Updated TypeScript types for workflow support
```

---

## Implementation Notes

### Best Practices
1. **Context Preparation**
   - Always gather system state before writing context
   - Include specific code examples and current implementations
   - Reference exact file paths and function names
   - Provide current database schema and types
   - **NEW**: Include status system state and utilities

2. **Information Hierarchy**
   - Start with high-level business requirements
   - Progress to technical implementation details
   - Include specific constraints and preferences
   - End with expected deliverables and format
   - **NEW**: Consider status system compatibility throughout

3. **Technical Context**
   - Always specify current technology versions
   - Include relevant configuration details
   - Reference established patterns and conventions
   - Provide examples of similar existing implementations
   - **NEW**: Reference status system utilities and patterns

4. **Iterative Refinement**
   - Start with core context components
   - Add specific details based on task complexity
   - Validate context against actual system state
   - Update context as requirements evolve
   - **NEW**: Test status system compatibility

### Common Pitfalls
1. **Insufficient Technical Detail**
   - Avoid: "Update the database"
   - Better: "Add task_dependencies table with foreign keys to tasks.id, include created_at timestamp, ensure compatibility with dual status system"

2. **Vague Requirements**
   - Avoid: "Make it better"
   - Better: "Improve task list performance to load under 2 seconds for 1000+ tasks while maintaining inline editing and status system functionality"

3. **Missing Constraints**
   - Avoid: Assuming AI knows coding standards
   - Better: "Follow existing patterns in components/tasks/, use TypeScript interfaces from lib/types/, utilize status system utilities from lib/utils/status-system.ts"

4. **Incomplete State Information**
   - Avoid: Only describing desired end state
   - Better: Include current implementation, what works, what doesn't, status system state

5. **Overlooking Dependencies**
   - Avoid: Treating features in isolation
   - Better: "Consider impact on task filtering, search, board view components, and both status systems"

6. **Status System Oversight (NEW)**
   - Avoid: Ignoring dual status system implications
   - Better: "Ensure compatibility with both custom and traditional status systems, utilize existing status system utilities"

### Validation Steps
1. **Pre-Implementation Review**
   - Confirm all 7 context components are addressed
   - Verify technical details match current system
   - Ensure requirements are specific and measurable
   - **NEW**: Validate status system compatibility

2. **Post-Implementation Validation**
   - Test solution against success criteria
   - Verify no breaking changes introduced
   - Confirm code follows established patterns
   - Validate security and performance implications
   - **NEW**: Test status system synchronization

3. **Documentation Updates**
   - Update relevant technical documentation
   - Record architectural decisions made
   - Note any new patterns or conventions established
   - **NEW**: Document status system changes

---

## Recent Project Success: 5-Phase Branch Merge (Completed January 2025)

### Lessons Learned
The recent successful completion of a 5-phase branch merge project provides valuable insights:

1. **Phased Approach**: Breaking complex changes into phases (Database → Types → Backend → UI → Testing) proved highly effective
2. **Comprehensive Testing**: Automated validation scripts and manual testing ensured quality
3. **Documentation**: Detailed phase completion summaries aided project tracking
4. **Backward Compatibility**: Zero breaking changes maintained user experience
5. **Status System Integration**: Dual status system approach provided flexibility without disruption

### Applied Best Practices
- **Migration Strategy**: Database migrations with rollback capability
- **Type Safety**: Comprehensive TypeScript support throughout
- **Interactive Features**: Inline editing and global undo enhanced user experience
- **Performance**: No regressions while adding significant functionality
- **Documentation**: Complete implementation guides for future reference

### Current System Capabilities (Post-Merge)
- **Dual Status System**: Both custom and traditional status systems working harmoniously
- **Interactive UI**: Click-to-edit status and dates with real-time updates
- **Global Undo**: Comprehensive undo system across all operations
- **Advanced Filtering**: Status-based filtering with dashboard counts
- **Type Safety**: Full TypeScript support with comprehensive type guards
- **Database Triggers**: Automatic status synchronization between systems
- **Production Ready**: 71% test pass rate with 100% functional success

### Context Engineering Success Factors
1. **Complete System State**: Detailed current state analysis before changes
2. **Specific Requirements**: Clear success criteria and constraints
3. **Technical Depth**: Exact file paths, function names, and implementation details
4. **Risk Assessment**: Comprehensive impact analysis and mitigation strategies
5. **Iterative Validation**: Continuous testing and validation throughout development

---

## Template Usage Instructions

### For New Feature Development
1. Copy the "Scenario 1" template
2. Fill in specific feature requirements
3. Add relevant code references and examples
4. Specify UI/UX requirements including interactive features
5. Include testing and validation criteria
6. **NEW**: Consider status system integration

### For Bug Fixes
1. Use abbreviated template focusing on current state
2. Clearly describe the problematic behavior
3. Include error logs and reproduction steps
4. Reference related code components
5. Specify expected behavior after fix
6. **NEW**: Check status system impact

### For Performance/Security Work
1. Use "Scenario 2" or "Scenario 3" as baseline
2. Include current metrics and target improvements
3. Reference monitoring and testing tools
4. Specify non-functional requirements
5. Include compliance or performance standards
6. **NEW**: Maintain interactive feature performance

### For Status System Work (NEW)
1. Use "Scenario 4" as baseline
2. Reference existing status system utilities
3. Consider impact on both status systems
4. Include database trigger implications
5. Specify UI interaction requirements
6. Plan for backward compatibility

---

## Current Technology Stack (January 2025)

### Frontend
- **Framework**: Next.js 15 with App Router
- **React**: Version 19 with Server/Client Components
- **TypeScript**: Version 5 with strict mode
- **Styling**: Tailwind CSS 3.4+ with custom CSS variables
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Fonts**: Geist Sans
- **Theme**: next-themes for dark/light mode

### Backend & Database
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth with middleware
- **ORM**: Direct SQL with Supabase client
- **Migrations**: Custom SQL migration files
- **Real-time**: Supabase real-time subscriptions

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Next.js with Turbopack (dev)
- **Linting**: ESLint 9 with Next.js config
- **Type Checking**: TypeScript compiler
- **Development**: Hot reload with Next.js dev server

### Key Dependencies
```json
{
  "@supabase/ssr": "latest",
  "@supabase/supabase-js": "latest",
  "next": "latest",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^3.4.1",
  "zod": "^3.25.69",
  "react-hook-form": "^7.59.0",
  "date-fns": "^4.1.0",
  "lucide-react": "^0.511.0"
}
```

---

This template ensures comprehensive, consistent context engineering for optimal AI assistance with the task management application, incorporating lessons learned from successful project completion and current system capabilities as of January 2025. 