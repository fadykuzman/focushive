#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting FocusHive build process...\n');

// Enhanced logging function
function logSection(title, fn) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔄 ${title}`);
  console.log(`${'='.repeat(60)}`);
  
  const startTime = Date.now();
  
  try {
    const result = fn();
    const duration = Date.now() - startTime;
    
    console.log(`✅ ${title} completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.log(`❌ ${title} failed after ${duration}ms`);
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

// Step 1: Run tests with detailed reporting
logSection('Running Test Suite', () => {
  console.log('📊 Executing comprehensive test suite...');
  
  try {
    const output = execSync('pnpm test:run', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('📈 Test Output:');
    console.log(output);
    
    // Extract test summary from output
    const lines = output.split('\n');
    const summaryLine = lines.find(line => line.includes('Test Files') && line.includes('passed'));
    if (summaryLine) {
      console.log(`\n🎯 Test Summary: ${summaryLine.trim()}`);
    }
    
  } catch (error) {
    console.log('❌ Tests failed:');
    console.log(error.stdout || error.message);
    throw error;
  }
});

// Step 2: Generate test reports
logSection('Generating Test Reports', () => {
  console.log('📋 Generating multi-format test reports...');
  
  try {
    const output = execSync('pnpm test:report', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('📄 Report Generation Output:');
    console.log(output);
    
    // Check if reports were generated successfully
    const reportsExist = [
      'public/reports/index.html',
      'reports/junit.xml', 
      'reports/results.json'
    ].map(file => {
      const exists = fs.existsSync(file);
      console.log(`${exists ? '✅' : '❌'} ${file}: ${exists ? 'Generated' : 'Missing'}`);
      return exists;
    });
    
    if (reportsExist.every(exists => exists)) {
      console.log('✅ All test reports generated successfully');
      
      // Read and display test summary from JSON report
      try {
        const resultsPath = 'reports/results.json';
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        
        console.log('\n📊 Test Results Summary:');
        console.log(`   Total Tests: ${results.numTotalTests}`);
        console.log(`   Passed: ${results.numPassedTests} ✅`);
        console.log(`   Failed: ${results.numFailedTests} ${results.numFailedTests > 0 ? '❌' : '✅'}`);
        console.log(`   Success Rate: ${((results.numPassedTests / results.numTotalTests) * 100).toFixed(1)}%`);
        console.log(`   Overall Status: ${results.success ? 'PASSED ✅' : 'FAILED ❌'}`);
        
        if (results.numFailedTests > 0) {
          console.log(`\n⚠️  Warning: ${results.numFailedTests} tests are failing but build will continue`);
        }
        
      } catch (parseError) {
        console.log('⚠️  Could not parse test results for summary');
      }
      
    } else {
      console.log('⚠️  Some test reports failed to generate');
    }
    
  } catch (error) {
    console.log('❌ Test report generation failed:');
    console.log(error.stdout || error.message);
    // Don't fail the build for report generation issues
    console.log('⚠️  Continuing build without reports...');
  }
});

// Step 3: Build Next.js application
logSection('Building Next.js Application', () => {
  console.log('🏗️  Building production Next.js application...');
  
  try {
    const output = execSync('next build --turbopack', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('🏗️  Build Output:');
    console.log(output);
    
    // Extract build summary
    const lines = output.split('\n');
    const routeInfo = lines.filter(line => 
      line.includes('├') || line.includes('└') || line.includes('Route')
    );
    
    if (routeInfo.length > 0) {
      console.log('\n📋 Build Summary:');
      routeInfo.forEach(line => console.log(`   ${line}`));
    }
    
    console.log('\n✨ Build completed successfully!');
    
  } catch (error) {
    console.log('❌ Next.js build failed:');
    console.log(error.stdout || error.message);
    throw error;
  }
});

// Final summary
console.log('\n' + '='.repeat(60));
console.log('🎉 FocusHive build process completed successfully!');
console.log('='.repeat(60));
console.log('📊 Reports available at: /reports');
console.log('🌐 Application ready for deployment');
console.log('='.repeat(60) + '\n');