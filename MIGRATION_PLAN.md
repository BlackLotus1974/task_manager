# Database Schema Migration Plan
## Merging new-ui-design Functionality with Master UI

### Overview
This migration plan enables gradual integration of the new-ui-design branch's expanded functionality while preserving the current master branch's UI and user experience.

### Current State Analysis

#### Master Branch (Current)
- **Status System**: Custom status values (`urgent`, `priority_2`, `priority_3`, `done`)
- **Database Schema**: Full expanded schema with all tables (tasks, projects, users, comments, attachments, tags, notifications, etc.)
- **UI**: Advanced features including inline editing, undo functionality, interactive components
- **Priority Field**: Deprecated integer field in tasks table

#### New-UI-Design Branch
- **Status System**: Traditional status (`todo`, `in_progress`, `done`) + separate priority field (1-4)
- **Database Schema**: Identical table structure but different status constraints
- **UI**: Simpler interface, missing advanced features
- **Priority Field**: Active integer field (1=Low, 2=Medium, 3=High, 4=Urgent)

### Migration Strategy

#### Phase 1: Database Schema Harmonization ✅
**Status**: Complete
**Files Created**:
- `lib/database/migrations/harmonize_status_system.sql`
- `lib/database/migrations/rollback_harmonize_status_system.sql`

**Key Features**:
1. **Dual Status System Support**: Adds `traditional_status` and `priority_level` columns
2. **Automatic Synchronization**: Trigger-based sync between status systems
3. **Backward Compatibility**: Preserves existing data and functionality
4. **Utility Views**: Separate views for each status system
5. **Helper Functions**: Conversion utilities between systems

#### Phase 2: Type System Harmonization (Next)
**Objective**: Update TypeScript types to support both status systems
**Files to Modify**:
- `lib/types/index.ts`
- Create new interfaces for dual system support
- Add utility type guards and conversion functions

#### Phase 3: Backend Integration (Next)
**Objective**: Ensure backend functions work with both status systems
**Files to Modify**:
- `lib/database/tasks.ts`
- `lib/actions/tasks.ts`
- Add support for new database fields
- Maintain API compatibility

#### Phase 4: Advanced UI Features Integration (Next)
**Objective**: Port missing advanced features to work with expanded data model
**Files to Create/Restore**:
- `components/tasks/inline-status-editor.tsx`
- `components/tasks/inline-date-editor.tsx`
- `contexts/undo-context.tsx`
- `components/tasks/undo-toast.tsx`
- `components/tasks/task-row.tsx`
- `components/dashboard/header-icons.tsx`

#### Phase 5: Testing and Validation (Final)
**Objective**: Comprehensive testing of merged functionality
**Areas to Test**:
- Status system synchronization
- UI component functionality
- Data integrity
- Performance impact
- User experience consistency

### Migration Execution Plan

#### Step 1: Apply Database Migration
```bash
# Apply the harmonization migration
psql -d your_database -f lib/database/migrations/harmonize_status_system.sql
```

#### Step 2: Verify Migration Success
```sql
-- Check new columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name IN ('traditional_status', 'priority_level');

-- Verify trigger exists
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'tasks' AND trigger_name = 'sync_task_status_trigger';

-- Test synchronization
UPDATE tasks SET status = 'urgent' WHERE id = 'some-task-id';
SELECT status, traditional_status, priority_level FROM tasks WHERE id = 'some-task-id';
```

#### Step 3: Update Application Code
- Modify types to support both systems
- Update backend functions
- Restore advanced UI components

### Risk Mitigation

#### Data Safety
- **Backup Strategy**: Full database backup before migration
- **Rollback Plan**: Tested rollback migration available
- **Testing**: Comprehensive testing on staging environment

#### Performance Impact
- **Minimal Impact**: New columns are nullable and indexed
- **Trigger Overhead**: Minimal overhead from synchronization trigger
- **Query Performance**: Existing queries remain unchanged

#### User Experience
- **Zero Downtime**: Migration can be applied without service interruption
- **Backward Compatibility**: Existing functionality remains intact
- **Gradual Transition**: Can switch between systems gradually

### Success Criteria

#### Technical Success
- [ ] Database migration completes without errors
- [ ] All existing functionality continues to work
- [ ] New status system functions correctly
- [ ] Synchronization trigger works properly
- [ ] Performance remains acceptable

#### User Experience Success
- [ ] Current UI behavior is preserved
- [ ] Advanced features (inline editing, undo) work correctly
- [ ] Status changes reflect properly in both systems
- [ ] No data loss or corruption

### Rollback Procedure

If issues arise, the migration can be safely rolled back:

```bash
# Apply rollback migration
psql -d your_database -f lib/database/migrations/rollback_harmonize_status_system.sql

# Verify rollback success
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'tasks' AND column_name IN ('traditional_status', 'priority_level');
# Should return no rows
```

### Next Steps

1. **Execute Phase 1**: Apply database migration
2. **Begin Phase 2**: Update type system
3. **Continue with Phase 3**: Backend integration
4. **Implement Phase 4**: UI features restoration
5. **Complete Phase 5**: Testing and validation

### Monitoring and Maintenance

#### Post-Migration Monitoring
- Monitor database performance
- Check synchronization accuracy
- Validate user experience
- Track error rates

#### Long-term Maintenance
- Regular backup verification
- Performance optimization
- User feedback integration
- Future migration planning

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-XX  
**Next Review**: After Phase 1 completion 