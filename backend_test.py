import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any

class ShareMatosAPITester:
    def __init__(self, base_url="https://sharematos-landing.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "name": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"\n{status} - {name}")
        if details:
            print(f"  Details: {details}")

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_base}/", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Response: {data.get('message', 'No message')}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, f"Error: {str(e)}")
            return False

    def test_create_waitlist_entry(self, test_data: Dict[str, Any]) -> Dict[str, Any]:
        """Test creating a waitlist entry"""
        try:
            response = requests.post(
                f"{self.api_base}/waitlist",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", ID: {data.get('id', 'No ID')}"
                self.log_test(f"Create Waitlist Entry - {test_data['prenom']}", True, details)
                return data
            else:
                error_msg = response.text
                self.log_test(f"Create Waitlist Entry - {test_data['prenom']}", False, f"{details}, Error: {error_msg}")
                return {}
                
        except Exception as e:
            self.log_test(f"Create Waitlist Entry - {test_data['prenom']}", False, f"Error: {str(e)}")
            return {}

    def test_duplicate_email(self, test_data: Dict[str, Any]):
        """Test duplicate email detection"""
        try:
            # Try to create the same entry again
            response = requests.post(
                f"{self.api_base}/waitlist",
                json=test_data,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            # Should return 400 for duplicate email
            success = response.status_code == 400
            details = f"Status: {response.status_code}"
            if not success and response.status_code == 200:
                details += " - Expected 400 for duplicate email, got 200"
            elif success:
                details += " - Correctly rejected duplicate email"
            
            self.log_test("Duplicate Email Detection", success, details)
            return success
            
        except Exception as e:
            self.log_test("Duplicate Email Detection", False, f"Error: {str(e)}")
            return False

    def test_get_waitlist_entries(self):
        """Test getting all waitlist entries"""
        try:
            response = requests.get(f"{self.api_base}/waitlist", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Found {len(data)} entries"
                self.log_test("Get Waitlist Entries", True, details)
                return data
            else:
                self.log_test("Get Waitlist Entries", False, details)
                return []
                
        except Exception as e:
            self.log_test("Get Waitlist Entries", False, f"Error: {str(e)}")
            return []

    def test_get_waitlist_count(self):
        """Test getting waitlist count"""
        try:
            response = requests.get(f"{self.api_base}/waitlist/count", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                count = data.get('count', 0)
                details += f", Count: {count}"
                self.log_test("Get Waitlist Count", True, details)
                return count
            else:
                self.log_test("Get Waitlist Count", False, details)
                return None
                
        except Exception as e:
            self.log_test("Get Waitlist Count", False, f"Error: {str(e)}")
            return None

    def test_invalid_data(self):
        """Test API with invalid data"""
        invalid_cases = [
            {
                "name": "Missing required fields",
                "data": {"prenom": "Test"},
                "expected_status": 422
            },
            {
                "name": "Invalid email format", 
                "data": {
                    "prenom": "Test",
                    "email": "invalid-email",
                    "ville": "Lille",
                    "userType": {"louer": True, "proposer": False}
                },
                "expected_status": 422
            },
            {
                "name": "Empty userType",
                "data": {
                    "prenom": "Test",
                    "email": "test@example.com",
                    "ville": "Lille", 
                    "userType": {"louer": False, "proposer": False}
                },
                "expected_status": 200  # This should be accepted by API, validation is frontend
            }
        ]

        for case in invalid_cases:
            try:
                response = requests.post(
                    f"{self.api_base}/waitlist",
                    json=case["data"],
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                success = response.status_code == case["expected_status"]
                details = f"Status: {response.status_code}, Expected: {case['expected_status']}"
                self.log_test(f"Invalid Data - {case['name']}", success, details)
                
            except Exception as e:
                self.log_test(f"Invalid Data - {case['name']}", False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run comprehensive API tests"""
        print("🚀 Starting ShareMatos API Tests")
        print(f"Testing against: {self.base_url}")
        print("=" * 50)

        # Test 1: API root
        if not self.test_api_root():
            print("❌ API is not accessible. Stopping tests.")
            return False

        # Test 2: Create valid waitlist entries
        test_users = [
            {
                "prenom": "Marc",
                "email": f"marc.test.{datetime.now().strftime('%H%M%S')}@example.com",
                "ville": "Lille",
                "userType": {"louer": True, "proposer": False}
            },
            {
                "prenom": "Sophie", 
                "email": f"sophie.test.{datetime.now().strftime('%H%M%S')}@example.com",
                "ville": "Roubaix",
                "userType": {"louer": False, "proposer": True}
            },
            {
                "prenom": "Pierre",
                "email": f"pierre.test.{datetime.now().strftime('%H%M%S')}@example.com", 
                "ville": "Tourcoing",
                "userType": {"louer": True, "proposer": True}
            }
        ]

        created_entries = []
        for user in test_users:
            entry = self.test_create_waitlist_entry(user)
            if entry:
                created_entries.append(entry)

        # Test 3: Duplicate email detection (use first user)
        if created_entries:
            self.test_duplicate_email(test_users[0])

        # Test 4: Get all entries
        all_entries = self.test_get_waitlist_entries()

        # Test 5: Get count
        count = self.test_get_waitlist_count()

        # Test 6: Invalid data
        self.test_invalid_data()

        # Print final results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = ShareMatosAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results for debugging
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "summary": {
                "total_tests": tester.tests_run,
                "passed_tests": tester.tests_passed,
                "failed_tests": tester.tests_run - tester.tests_passed,
                "success_rate": round((tester.tests_passed / tester.tests_run) * 100, 2) if tester.tests_run > 0 else 0
            },
            "detailed_results": tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())