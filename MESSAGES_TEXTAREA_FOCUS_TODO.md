# Messages Textarea Auto-Focus Issue

## Problem
When a user selects a message/match on the Messages page, the textarea input field does not automatically receive focus. Users must manually click inside the textarea to start typing.

## Expected Behavior
After selecting a match, the textarea should automatically be focused so users can start typing immediately without clicking.

## Attempted Solutions
1. ✗ `useEffect` with `textareaRef.current?.focus()` - Did not work
2. ✗ `autoFocus` attribute on textarea - Did not work
3. ✗ Ref callback with immediate focus - Did not work
4. ✗ Adding delay with `setTimeout` - Did not work
5. ✗ Focus in onClick handler - Did not work
6. ✗ Using `key` prop to force re-mount - Did not work

## Possible Causes
- Browser security restrictions preventing programmatic focus
- Focus being stolen by another element
- React re-render cycle preventing focus from sticking
- CSS or layout issues preventing focus state

## Current Workaround
- Placeholder text updated to hint: "Type a message... (or press Tab to focus)"
- Users can use Tab key to navigate to textarea

## Files Involved
- `client-new/src/components/Messages/Messages.tsx` - Main component
- `client-new/src/components/Messages/Messages.css` - Styling

## Next Steps
- Investigate browser console for focus-related errors
- Check if there's a modal or overlay stealing focus
- Consider using a different approach (e.g., contentEditable div instead of textarea)
- Test in different browsers to see if it's browser-specific
- Review React version and focus handling best practices

## Status
⏸️ Parked for later investigation
