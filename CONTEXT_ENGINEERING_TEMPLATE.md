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
   - Current: Next.js App Router, Supabase, TypeScript, Tailwind CSS
   - Components: React Server/Client Components, shadcn/ui
   - Database: PostgreSQL with RLS policies
   - Authentication: Supabase Auth with role-based access

2. **Implementation Strategy**
   - Identify required changes to existing code
   - Plan new component creation
   - Consider database schema updates
   - Plan testing approach

3. **Risk Assessment**
   - Breaking changes impact
   - Security implications
   - Performance considerations
   - User experience effects

### Step 3: Context Assembly
1. **System Context**
   ```
   Application: Task Management System
   Stack: Next.js 15, React 19, Supabase, TypeScript, Tailwind CSS
   UI: shadcn/ui components with New York style
   Database: PostgreSQL with comprehensive RLS policies
   Authentication: Supabase Auth with admin/member roles
   ```

2. **Current Architecture**
   ```
   /app - Next.js App Router pages
   /components - Reusable UI components
   /lib - Database operations, types, utilities
   /middleware.ts - Supabase auth middleware
   Key Features: Tasks, Projects, Users, Comments, Attachments, Tags
   ```

3. **Development Context**
   ```
   Conventions: Server components by default, 'use client' when needed
   Styling: CSS variables with Tailwind classes
   Forms: react-hook-form with zod validation
   State: Server state via Supabase, client state with useState/useEffect
   ```

### Step 4: Quality Validation
1. **Completeness Check**: All required context components included
2. **Accuracy Verification**: Information is current and correct
3. **Relevance Assessment**: Context directly applies to the task
4. **Clarity Review**: Information is clearly structured and understandable

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

USER PROMPT:
"I need to add task dependencies so users can specify that one task must be completed before another can start."

STATE/HISTORY:
- Current task system supports: title, description, status, priority, due_date, project_id, assignees
- Database schema has tasks table with basic fields
- UI uses CreateTaskDialog and CreateTaskForm components
- Task filtering and board/list views are implemented

LONG-TERM MEMORY:
- Architecture: Next.js App Router with TypeScript
- Database: Supabase PostgreSQL with RLS
- UI: shadcn/ui components with custom CSS variables
- Pattern: Server actions for mutations, server components for data fetching

RETRIEVED INFORMATION:
- lib/database/schema.sql - current database structure
- lib/types/index.ts - TypeScript interfaces
- components/tasks/create-task-form.tsx - task creation UI
- lib/database/tasks.ts - task database operations

AVAILABLE TOOLS:
- mcp_supabase tools for database operations
- edit_file for code modifications
- codebase_search for exploring existing patterns

STRUCTURED OUTPUT:
1. Database migration for task_dependencies table
2. Updated TypeScript types
3. Modified task creation/edit forms
4. Updated task database operations
5. UI components for dependency visualization
```

### Scenario 2: Performance Optimization
**Context Template:**
```
INSTRUCTIONS:
- Optimize task loading performance on the dashboard
- Implement pagination or virtualization for large task lists
- Maintain current functionality and user experience
- Use existing technology stack

USER PROMPT:
"The task list is loading slowly when users have many tasks. We need to improve performance."

STATE/HISTORY:
- Current implementation loads all tasks at once
- getTasks function in lib/database/tasks.ts handles filtering
- TasksView component renders all tasks in memory
- Users report slow performance with 500+ tasks

LONG-TERM MEMORY:
- Performance: Prefer server-side optimizations
- UI: Maintain current list/board view functionality
- Data: Supabase PostgreSQL with proper indexing
- Caching: Next.js automatic caching for server components

RETRIEVED INFORMATION:
- lib/database/tasks.ts - current task fetching logic
- components/tasks/tasks-view.tsx - task rendering
- app/dashboard/tasks/page.tsx - page implementation
- Database indexes on tasks table

STRUCTURED OUTPUT:
1. Pagination implementation in getTasks function
2. Updated TasksView component with loading states
3. Infinite scroll or pagination UI components
4. Database query optimization
5. Performance monitoring additions
```

### Scenario 3: Security Enhancement
**Context Template:**
```
INSTRUCTIONS:
- Implement additional RLS policies for enhanced security
- Ensure project members can only access their project's tasks
- Add audit logging for sensitive operations
- Follow security best practices

USER PROMPT:
"We need to strengthen security so users can only see tasks from projects they're members of."

STATE/HISTORY:
- Current RLS policies provide basic task access control
- Project membership system exists with admin/member roles
- Some tasks may not be properly restricted by project membership
- Activity logging exists but may need enhancement

LONG-TERM MEMORY:
- Security: Row Level Security (RLS) is primary access control
- Architecture: Supabase handles authentication and authorization
- Patterns: Policy-based access control, server-side validation
- Compliance: Need audit trail for security operations

RETRIEVED INFORMATION:
- lib/database/schema.sql - current RLS policies
- Authentication middleware and user context
- Project membership implementation
- Current activity logging system

STRUCTURED OUTPUT:
1. Updated RLS policies for enhanced task access
2. Project membership validation improvements
3. Enhanced audit logging system
4. Security testing recommendations
5. Documentation updates for security model
```

---

## Implementation Notes

### Best Practices
1. **Context Preparation**
   - Always gather system state before writing context
   - Include specific code examples and current implementations
   - Reference exact file paths and function names
   - Provide current database schema and types

2. **Information Hierarchy**
   - Start with high-level business requirements
   - Progress to technical implementation details
   - Include specific constraints and preferences
   - End with expected deliverables and format

3. **Technical Context**
   - Always specify current technology versions
   - Include relevant configuration details
   - Reference established patterns and conventions
   - Provide examples of similar existing implementations

4. **Iterative Refinement**
   - Start with core context components
   - Add specific details based on task complexity
   - Validate context against actual system state
   - Update context as requirements evolve

### Common Pitfalls
1. **Insufficient Technical Detail**
   - Avoid: "Update the database"
   - Better: "Add task_dependencies table with foreign keys to tasks.id, include created_at timestamp"

2. **Vague Requirements**
   - Avoid: "Make it better"
   - Better: "Improve task list performance to load under 2 seconds for 1000+ tasks"

3. **Missing Constraints**
   - Avoid: Assuming AI knows coding standards
   - Better: "Follow existing patterns in components/tasks/, use TypeScript interfaces from lib/types/"

4. **Incomplete State Information**
   - Avoid: Only describing desired end state
   - Better: Include current implementation, what works, what doesn't

5. **Overlooking Dependencies**
   - Avoid: Treating features in isolation
   - Better: "Consider impact on task filtering, search, and board view components"

### Validation Steps
1. **Pre-Implementation Review**
   - Confirm all 7 context components are addressed
   - Verify technical details match current system
   - Ensure requirements are specific and measurable

2. **Post-Implementation Validation**
   - Test solution against success criteria
   - Verify no breaking changes introduced
   - Confirm code follows established patterns
   - Validate security and performance implications

3. **Documentation Updates**
   - Update relevant technical documentation
   - Record architectural decisions made
   - Note any new patterns or conventions established

---

## Template Usage Instructions

### For New Feature Development
1. Copy the "Scenario 1" template
2. Fill in specific feature requirements
3. Add relevant code references and examples
4. Specify UI/UX requirements
5. Include testing and validation criteria

### For Bug Fixes
1. Use abbreviated template focusing on current state
2. Clearly describe the problematic behavior
3. Include error logs and reproduction steps
4. Reference related code components
5. Specify expected behavior after fix

### For Performance/Security Work
1. Use "Scenario 2" or "Scenario 3" as baseline
2. Include current metrics and target improvements
3. Reference monitoring and testing tools
4. Specify non-functional requirements
5. Include compliance or performance standards

This template ensures comprehensive, consistent context engineering for optimal AI assistance with the task management application. 