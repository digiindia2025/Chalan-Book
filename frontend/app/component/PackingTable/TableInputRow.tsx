
    import React, { useRef } from "react";

    interface TableRowItem {
      sNo: number;
      qty1: string;
      shadeNo1: string;
      qty2: string;
      shadeNo2: string;
      qty3: string;
      shadeNo3: string;
    }

    interface TableInputRowProps {
      index: number;
      item: TableRowItem;
      handleInputChange: (index: number, field: string, value: string) => void;
      focusNextRow?: (currentRow: number, column: number) => void;
    }

    const TableInputRow: React.FC<TableInputRowProps> = ({ 
      index, 
      item, 
      handleInputChange, 
      focusNextRow 
    }) => {
      // Create refs for all input fields
      const qty1Ref = useRef<HTMLInputElement>(null);
      const shadeNo1Ref = useRef<HTMLInputElement>(null);
      const qty2Ref = useRef<HTMLInputElement>(null);
      const shadeNo2Ref = useRef<HTMLInputElement>(null);
      const qty3Ref = useRef<HTMLInputElement>(null);
      const shadeNo3Ref = useRef<HTMLInputElement>(null);
      
      // Array of all refs for easier navigation
      const allRefs = [qty1Ref, shadeNo1Ref, qty2Ref, shadeNo2Ref, qty3Ref, shadeNo3Ref];
      
      // Common keyboard handler for all inputs
      const handleKeyDown = (e: React.KeyboardEvent, currentRefIndex: number) => {
        // Handle Tab (already implemented)
        if (e.key === 'Tab') {
          return; // Let default Tab behavior or existing handlers work
        }
        
        // Enter key - Go to input field in the next row at the same position
        if (e.key === 'Enter') {
          e.preventDefault();
          if (focusNextRow) {
            // Calculate which column group we're in (1, 2, or 3)
            const columnGroup = Math.floor(currentRefIndex / 2) + 1;
            focusNextRow(index, columnGroup);
          }
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextRefIndex = currentRefIndex + 1;
          if (nextRefIndex < allRefs.length) {
            allRefs[nextRefIndex].current?.focus();
          }
        }
        
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevRefIndex = currentRefIndex - 1;
          if (prevRefIndex >= 0) {
            allRefs[prevRefIndex].current?.focus();
          }
        }
        
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (focusNextRow) {
            const columnGroup = Math.floor(currentRefIndex / 2) + 1;
            focusNextRow(index, columnGroup);
          }
        }
        
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (index > 0 && focusNextRow) {
            const columnGroup = Math.floor(currentRefIndex / 2) + 1;
            focusNextRow(index - 1, columnGroup);
          }
        }
        
        
        // Home key - Go to first input in row
        if (e.key === 'Home') {
          e.preventDefault();
          qty1Ref.current?.focus();
        }
        
        // End key - Go to last input in row
        if (e.key === 'End') {
          e.preventDefault();
          shadeNo3Ref.current?.focus();
        }
        
        // Page Up key - Go to previous row, same column
        if (e.key === 'PageUp') {
          e.preventDefault();
          if (index > 0 && focusNextRow) {
            // To focus same column but previous row
            const columnGroup = Math.floor(currentRefIndex / 2) + 1;
            focusNextRow(index - 1, columnGroup);
          }
        }
        
        // Page Down key - Go to next row, same column
        if (e.key === 'PageDown') {
          e.preventDefault();
          if (focusNextRow) {
            // To focus same column but next row
            const columnGroup = Math.floor(currentRefIndex / 2) + 1;
            focusNextRow(index, columnGroup);
          }
        }
      };

      // Handle tab press on qty1
      const handleQty1KeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          shadeNo1Ref.current?.focus();
        } else {
          handleKeyDown(e, 0); // Pass the index of the current ref in allRefs
        }
      };

      // Handle tab press on shadeNo1
      const handleShadeNo1KeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          if (focusNextRow) {
            focusNextRow(index, 1); // 1 indicates the first column pair
          }
        } else {
          handleKeyDown(e, 1);
        }
      };

      // Handle tab press on qty2
      const handleQty2KeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          shadeNo2Ref.current?.focus();
        } else {
          handleKeyDown(e, 2);
        }
      };

      // Handle tab press on shadeNo2
      const handleShadeNo2KeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          if (focusNextRow) {
            focusNextRow(index, 2); // 2 indicates the second column pair
          }
        } else {
          handleKeyDown(e, 3);
        }
      };

      // Handle tab press on qty3
      const handleQty3KeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          shadeNo3Ref.current?.focus();
        } else {
          handleKeyDown(e, 4);
        }
      };

      // Handle tab press on shadeNo3
      const handleShadeNo3KeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          if (focusNextRow) {
            focusNextRow(index, 3); // 3 indicates the third column pair
          }
        } else {
          handleKeyDown(e, 5);
        }
      };

      return (
        <tr className="border-t">
          <td className="p-3">{item.sNo}</td>
          <td className="p-3">
            <input
              ref={qty1Ref}
              type="number"
              value={item.qty1}
              onChange={(e) => handleInputChange(index, "qty1", e.target.value)}
              onKeyDown={handleQty1KeyDown}
              className="border p-2 rounded w-full bg-gray-50"
            />
          </td>
          <td className="p-3">
            <input
              ref={shadeNo1Ref}
              type="text"
              value={item.shadeNo1}
              onChange={(e) => handleInputChange(index, "shadeNo1", e.target.value)}
              onKeyDown={handleShadeNo1KeyDown}
              className="border p-2 rounded w-full bg-gray-50"
            />
          </td>
          <td className="p-3">
            <input
              ref={qty2Ref}
              type="number"
              value={item.qty2}
              onChange={(e) => handleInputChange(index, "qty2", e.target.value)}
              onKeyDown={handleQty2KeyDown}
              className="border p-2 rounded w-full bg-gray-50"
            />
          </td>
          <td className="p-3">
            <input
              ref={shadeNo2Ref}
              type="text"
              value={item.shadeNo2}
              onChange={(e) => handleInputChange(index, "shadeNo2", e.target.value)}
              onKeyDown={handleShadeNo2KeyDown}
              className="border p-2 rounded w-full bg-gray-50"
            />
          </td>
          <td className="p-3">
            <input
              ref={qty3Ref}
              type="number"
              value={item.qty3}
              onChange={(e) => handleInputChange(index, "qty3", e.target.value)}
              onKeyDown={handleQty3KeyDown}
              className="border p-2 rounded w-full bg-gray-50"
            />
          </td>
          <td className="p-3">
            <input
              ref={shadeNo3Ref}
              type="text"
              value={item.shadeNo3}
              onChange={(e) => handleInputChange(index, "shadeNo3", e.target.value)}
              onKeyDown={handleShadeNo3KeyDown}
              className="border p-2 rounded w-full bg-gray-50"
            />
          </td>
        </tr>
      );
    };

    export default TableInputRow;
        