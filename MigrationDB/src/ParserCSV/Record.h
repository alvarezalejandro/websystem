#ifndef RECORD_H_
#define RECORD_H_
#include <string>
#include <vector>
using std::string;

class Record {
private:
	std::vector<string> fields;
public:
	Record();
	string GetField(int index) const;
	int GetFieldCount() const;
	void AddField(string field);
	virtual ~Record();
};

#endif
