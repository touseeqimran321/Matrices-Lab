import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Plus, Minus, X, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const MatrixCalculator = () => {
  const [matrixA, setMatrixA] = useState([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState([[5, 6], [7, 8]]);
  const [result, setResult] = useState([]);
  const [operation, setOperation] = useState('add');
  const [dimensions, setDimensions] = useState({ rows: 2, cols: 2 });
  const { toast } = useToast();

  const createEmptyMatrix = (rows, cols) => {
    if (rows <= 0 || cols <= 0) {
      return []; 
    }
    return Array(rows).fill(null).map(() => Array(cols).fill(0));
  };

  const updateDimensions = (newRowsInput, newColsInput) => {
    const newRows = parseInt(newRowsInput, 10);
    const newCols = parseInt(newColsInput, 10);

    if (isNaN(newRows) || isNaN(newCols) || newRows <= 0 || newCols <= 0) {
      toast({
        title: "Invalid Dimensions",
        description: "Rows and columns must be positive numbers.",
        variant: "destructive"
      });
      return;
    }
    
    const rows = Math.max(1, Math.min(6, newRows));
    const cols = Math.max(1, Math.min(6, newCols));
    
    setDimensions({ rows, cols });
    
    const newMatrixA = createEmptyMatrix(rows, cols);
    const newMatrixB = createEmptyMatrix(rows, cols);
    
    if (newMatrixA.length > 0) {
      for (let i = 0; i < Math.min(rows, matrixA.length); i++) {
        for (let j = 0; j < Math.min(cols, matrixA[0]?.length || 0); j++) {
          if (newMatrixA[i] && matrixA[i]) newMatrixA[i][j] = matrixA[i]?.[j] || 0;
          if (newMatrixB[i] && matrixB[i]) newMatrixB[i][j] = matrixB[i]?.[j] || 0;
        }
      }
    }
    
    setMatrixA(newMatrixA);
    setMatrixB(newMatrixB);
  };

  const updateMatrixValue = (matrix, setMatrix, row, col, value) => {
    const newMatrix = matrix.map(r => [...r]);
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  const addMatrices = (a, b) => {
    if (a.length !== b.length || a[0]?.length !== b[0]?.length) {
      throw new Error('Matrices must have the same dimensions for addition');
    }
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  };

  const subtractMatrices = (a, b) => {
    if (a.length !== b.length || a[0]?.length !== b[0]?.length) {
      throw new Error('Matrices must have the same dimensions for subtraction');
    }
    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
  };

  const multiplyMatrices = (a, b) => {
    if (a[0]?.length !== b.length) {
      throw new Error('Number of columns in first matrix must equal number of rows in second matrix');
    }
    
    const result = Array(a.length).fill(null).map(() => Array(b[0].length).fill(0));
    
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < b.length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    
    return result;
  };

  const transposeMatrix = (matrix) => {
    if (!matrix || matrix.length === 0 || !matrix[0]) return [];
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  };

  const calculateDeterminant = (matrix) => {
    if (!matrix || matrix.length === 0 || !matrix[0]) {
      throw new Error('Invalid matrix for determinant calculation');
    }
    const n = matrix.length;
    if (n !== matrix[0].length) {
      throw new Error('Matrix must be square to calculate determinant');
    }
    
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let i = 0; i < n; i++) {
      const subMatrix = matrix.slice(1).map(row => 
        row.filter((_, colIndex) => colIndex !== i)
      );
      det += Math.pow(-1, i) * matrix[0][i] * calculateDeterminant(subMatrix);
    }
    
    return det;
  };

  const calculateRREF = (matrix) => {
    if (!matrix || matrix.length === 0 || !matrix[0]) return [];
    const result = matrix.map(row => [...row]);
    const rows = result.length;
    const cols = result[0].length;
    
    let currentRow = 0;
    
    for (let col = 0; col < cols && currentRow < rows; col++) {
      let pivotRow = currentRow;
      for (let row = currentRow + 1; row < rows; row++) {
        if (Math.abs(result[row][col]) > Math.abs(result[pivotRow][col])) {
          pivotRow = row;
        }
      }
      
      if (Math.abs(result[pivotRow][col]) < 1e-10) continue;
      
      if (pivotRow !== currentRow) {
        [result[currentRow], result[pivotRow]] = [result[pivotRow], result[currentRow]];
      }
      
      const pivot = result[currentRow][col];
      for (let j = 0; j < cols; j++) {
        result[currentRow][j] /= pivot;
      }
      
      for (let row = 0; row < rows; row++) {
        if (row !== currentRow && Math.abs(result[row][col]) > 1e-10) {
          const factor = result[row][col];
          for (let j = 0; j < cols; j++) {
            result[row][j] -= factor * result[currentRow][j];
          }
        }
      }
      
      currentRow++;
    }
    
    return result.map(row => row.map(val => Math.round(val * 1000) / 1000));
  };

  const performOperation = () => {
    try {
      let newResult = [];
      
      if (!matrixA || matrixA.length === 0) {
        toast({
          title: "Invalid Matrix A",
          description: "Matrix A is not properly defined.",
          variant: "destructive"
        });
        return;
      }
      if ((operation === 'add' || operation === 'subtract' || operation === 'multiply') && (!matrixB || matrixB.length === 0)) {
         toast({
          title: "Invalid Matrix B",
          description: "Matrix B is not properly defined for this operation.",
          variant: "destructive"
        });
        return;
      }

      switch (operation) {
        case 'add':
          newResult = addMatrices(matrixA, matrixB);
          break;
        case 'subtract':
          newResult = subtractMatrices(matrixA, matrixB);
          break;
        case 'multiply':
          newResult = multiplyMatrices(matrixA, matrixB);
          break;
        case 'transpose':
          newResult = transposeMatrix(matrixA);
          break;
        case 'determinant':
          const det = calculateDeterminant(matrixA);
          newResult = [[det]];
          break;
        case 'rref':
          newResult = calculateRREF(matrixA);
          break;
        default:
          throw new Error('Unknown operation');
      }
      
      setResult(newResult);
      toast({
        title: "Calculation Complete!",
        description: `Successfully performed ${operation} operation`,
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const renderMatrix = (matrix, title, setMatrixFn = null) => {
    if (!matrix || matrix.length === 0 || !matrix[0]) {
      return (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="p-4 bg-muted rounded-lg text-center text-muted-foreground">
            Matrix not available or dimensions are invalid.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="p-4 bg-muted rounded-lg overflow-x-auto">
          <div 
            className="matrix-grid"
            style={{
              gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, minmax(0, 1fr))`
            }}
          >
            {matrix.map((row, i) =>
              row.map((val, j) => (
                <div key={`${i}-${j}`} className="matrix-cell">
                  {setMatrixFn ? (
                    <Input
                      type="number"
                      value={val}
                      onChange={(e) => updateMatrixValue(matrix, setMatrixFn, i, j, e.target.value)}
                      className="w-full h-8 text-xs text-center border-0 bg-transparent p-1"
                      step="0.1"
                    />
                  ) : (
                    <span className="text-xs">{typeof val === 'number' ? val.toFixed(2) : val}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Matrix Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rows">Rows</Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="6"
                value={dimensions.rows}
                onChange={(e) => updateDimensions(e.target.value, dimensions.cols)}
              />
            </div>
            <div>
              <Label htmlFor="cols">Columns</Label>
              <Input
                id="cols"
                type="number"
                min="1"
                max="6"
                value={dimensions.cols}
                onChange={(e) => updateDimensions(dimensions.rows, e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Operation</Label>
            <div className="flex gap-2">
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Addition (A + B)</SelectItem>
                  <SelectItem value="subtract">Subtraction (A - B)</SelectItem>
                  <SelectItem value="multiply">Multiplication (A × B)</SelectItem>
                  <SelectItem value="transpose">Transpose (A^T)</SelectItem>
                  <SelectItem value="determinant">Determinant (det A)</SelectItem>
                  <SelectItem value="rref">RREF (A)</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={performOperation} className="pulse-glow">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderMatrix(matrixA, "Matrix A", setMatrixA)}
            {(operation === 'add' || operation === 'subtract' || operation === 'multiply') && 
              renderMatrix(matrixB, "Matrix B", setMatrixB)
            }
          </div>

          {result.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderMatrix(result, "Result")}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatrixCalculator;